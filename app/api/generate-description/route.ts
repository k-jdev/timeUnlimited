import { NextRequest } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { requireAuth } from "@/lib/authHelpers"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  const authResult = requireAuth(req)
  if (authResult instanceof Response) return authResult

  try {
    const body = await req.json()
    const {
      brand,
      model,
      condition,
      caseMaterial,
      caseSize,
      dial,
      completeSet,
    } = body

    if (!brand && !model) {
      return Response.json(
        { error: "At least brand or model is required" },
        { status: 400 }
      )
    }

    const model_ = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const details = [
      brand && `Brand: ${brand}`,
      model && `Model: ${model}`,
      condition && `Condition: ${condition}`,
      caseMaterial && `Case Material: ${caseMaterial}`,
      caseSize && `Case Size: ${caseSize}`,
      dial && `Dial Color: ${dial}`,
      completeSet && `Complete Set: ${completeSet}`,
    ]
      .filter(Boolean)
      .join("\n")

    const prompt = `You are a luxury watch copywriter. Write a compelling product description for a watch with the following details:

${details}

Requirements:
- 2-3 paragraphs
- Professional and elegant tone suitable for a luxury watch retailer
- Highlight craftsmanship, heritage, and key features based on the provided details
- Do NOT use markdown formatting, bullet points, or headers
- Return only plain text, no extra commentary`

    const result = await model_.generateContent(prompt)
    const description = result.response.text().trim()

    return Response.json({ description })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("[generate-description] ERROR:", message)
    return Response.json(
      { error: "Failed to generate description", detail: message },
      { status: 500 }
    )
  }
}
