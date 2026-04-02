import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { requireAuth } from "@/lib/authHelpers"

export async function GET(req: NextRequest) {
  const authResult = requireAuth(req)
  if (authResult instanceof Response) return authResult

  const res = await pool.query(`
    SELECT * FROM products
    ORDER BY show_on_main DESC, show_order ASC, created_at DESC
  `)

  return NextResponse.json(res.rows)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const authResult = requireAuth(req)
  if (authResult instanceof Response) return authResult

  const id = uuidv4()
  const now = new Date().toISOString()

  const query = `
    INSERT INTO products
    (
      id, brand, model, price, reference_number, description,
      condition, case_material, case_size, dial, complete_set,
      hover_color, status, dial_color,
      show_on_main, show_order,
      created_at, updated_at
    )
    VALUES
    (
      $1,$2,$3,$4,$5,$6,
      $7,$8,$9,$10,$11,
      $12,$13,$14,
      $15,$16,
      $17,$18
    )
  `

  const values = [
    id,
    data.brand,
    data.model,
    data.price,
    data.referenceNumber,
    data.description,
    data.condition,
    data.caseMaterial,
    data.caseSize,
    data.dial,
    data.completeSet,
    data.hoverColor,
    data.status ?? "active",
    data.dialColor ?? data.dial,
    data.show_on_main ?? false,
    data.show_order ?? 0,

    now,
    now,
  ]

  try {
    await pool.query(query, values)
  } catch (err) {
    console.error("Failed to insert product:", err)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ id })
}