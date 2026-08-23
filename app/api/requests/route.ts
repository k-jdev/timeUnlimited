import { NextRequest, NextResponse } from "next/server"
import { pool, type SqlValue } from "@/lib/db"
import { requireAuth } from "@/lib/authHelpers"

/** Shape of a row in the `requests` table. */
interface RequestRow {
  id: string
  created_date: string
  status: string
  client_name: string | null
  email: string | null
  phone: string | null
  budget_range: string | null
  timeframe: string | null
  brand_preferences: string | null
  purpose: string | null
  material: string | null
  region: string | null
}

export async function GET(req: NextRequest) {
  const authResult = requireAuth(req)
  if (authResult instanceof Response) return authResult

  try {
    const { searchParams } = new URL(req.url)

    const filters: string[] = []
    const values: SqlValue[] = []

    const budget = searchParams.get("budget_range")
    const timeframe = searchParams.get("timeframe")
    const brand = searchParams.get("brand_preferences")
    const material = searchParams.get("material")
    const region = searchParams.get("region")
    const type = searchParams.get("type")

    let index = 1

    filters.push(`type = $${index++}`)
    values.push(type)

    if (budget) {
      filters.push(`budget_range = $${index++}`)
      values.push(budget)
    }
    if (timeframe) {
      filters.push(`timeframe = $${index++}`)
      values.push(timeframe)
    }
    if (brand) {
      filters.push(`brand_preferences ILIKE $${index++}`)
      values.push(`%${brand}%`)
    }
    if (material) {
      filters.push(`material = $${index++}`)
      values.push(material)
    }
    if (region) {
      filters.push(`region ILIKE $${index++}`)
      values.push(`%${region}%`)
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : ""
    const query = `SELECT * FROM requests ${whereClause} ORDER BY created_date DESC`

    const res = await pool.query<RequestRow>(query, values)

    const mapped = res.rows.map((r) => ({
      id: r.id,
      requestNumber: r.id,
      createdAt: r.created_date,
      status: r.status,
      name: r.client_name || "",
      email: r.email || "",
      phone: r.phone || "",
      budgetRange: r.budget_range || "",
      timeframe: r.timeframe || "",
      watchReference: r.client_name || "",
      brandPreferences: r.brand_preferences || "",
      purpose: r.purpose || "",
      material: r.material || "",
      region: r.region || "",
      type: r.brand_preferences ? "assisted" : "specific",
    }))

    return NextResponse.json(mapped)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const result = await pool.query(
      `INSERT INTO requests 
      (created_date, assisted_by, status, brand_preferences, budget_range, material, timeframe, client_name, region, phone, email, purpose, type)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *`,
      [
        data.created_date,
        data.assisted_by || null,
        data.status || "New",
        data.brand_preferences,
        data.budget_range,
        data.material,
        data.timeframe,
        data.client_name,
        data.region,
        data.phone,
        data.email,
        data.purpose,
        data.type,
      ]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
