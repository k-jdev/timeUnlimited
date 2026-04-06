import { NextRequest } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { requireAuth } from "@/lib/authHelpers"
import { ALL_BRANDS, BRAND_MODELS } from "@/data/brand-models"
import {
  CONDITIONS,
  CASE_MATERIALS,
  SIZES,
  DIAL_COLORS,
} from "@/data/inventory"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const ALL_MODELS = Object.values(BRAND_MODELS).flat()

export async function POST(req: NextRequest) {
  const authResult = requireAuth(req)
  if (authResult instanceof Response) return authResult

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return Response.json({ error: "File must be an image" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: "File size must be under 5MB" },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const imageBase64 = Buffer.from(arrayBuffer).toString("base64")
    const mimeType = file.type as
      | "image/jpeg"
      | "image/png"
      | "image/webp"
      | "image/gif"

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `Analyze this watch image and return a JSON object with these exact fields.
Use ONLY values from the provided lists below — do not invent new values.

Return ONLY raw JSON with no markdown, no backticks, no explanation.

Fields:
- "brand": one of [${ALL_BRANDS.map((b) => `"${b}"`).join(", ")}]
- "model": one of [${ALL_MODELS.map((m) => `"${m}"`).join(", ")}]
- "condition": one of [${CONDITIONS.map((c) => `"${c}"`).join(", ")}]
- "caseMaterial": one of [${CASE_MATERIALS.map((m) => `"${m}"`).join(", ")}]
- "caseSize": one of [${SIZES.map((s) => `"${s}"`).join(", ")}] — pick the closest match
- "dial": one of [${DIAL_COLORS.map((d) => `"${d}"`).join(", ")}]

If you cannot determine a field with confidence, use the closest match from the list.

Example output:
{"brand":"Rolex","model":"Submariner","condition":"Pre-owned","caseMaterial":"Stainless Steel","caseSize":"41mm","dial":"Black"}`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType,
        },
      },
    ])

    const responseText = result.response.text()

    const cleanJson = responseText
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim()

    const parsed = JSON.parse(cleanJson)

    const safe = {
      brand: ALL_BRANDS.includes(parsed.brand) ? parsed.brand : "",
      model: ALL_MODELS.includes(parsed.model) ? parsed.model : "",
      condition: (CONDITIONS as readonly string[]).includes(parsed.condition)
        ? parsed.condition
        : "",
      caseMaterial: (CASE_MATERIALS as readonly string[]).includes(
        parsed.caseMaterial
      )
        ? parsed.caseMaterial
        : "",
      caseSize: (SIZES as readonly string[]).includes(parsed.caseSize)
        ? parsed.caseSize
        : "",
      dial: (DIAL_COLORS as readonly string[]).includes(parsed.dial)
        ? parsed.dial
        : "",
    }

    return Response.json(safe)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("[analyze-watch] ERROR:", message, error)
    return Response.json(
      { error: "Failed to analyze image", detail: message },
      { status: 500 }
    )
  }
}
