import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const search = searchParams.get("search")
  const brand = searchParams.get("brand")
  const condition = searchParams.get("condition")
  const caseMaterial = searchParams.get("caseMaterial")
  const dialColor = searchParams.get("dialColor")
  const size = searchParams.get("size")

  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")

  const sort = searchParams.get("sort") || "new"

  let query = `SELECT * FROM products WHERE status = 'active'`
  const values: any[] = []
  let i = 1

  if (search) {
    query += ` AND (
      brand ILIKE $${i}
      OR model ILIKE $${i}
      OR reference_number ILIKE $${i}
    )`
    values.push(`%${search}%`)
    i++
  }

  if (brand) {
    query += ` AND brand = $${i}`
    values.push(brand)
    i++
  }

  if (condition) {
    query += ` AND condition = $${i}`
    values.push(condition)
    i++
  }

  if (caseMaterial) {
    query += ` AND case_material = $${i}`
    values.push(caseMaterial)
    i++
  }

  if (dialColor) {
    query += ` AND dial_color = $${i}`
    values.push(dialColor)
    i++
  }

  if (size) {
    query += ` AND case_size = $${i}`
    values.push(size)
    i++
  }

  if (minPrice) {
    query += ` AND price >= $${i}`
    values.push(minPrice)
    i++
  }

  if (maxPrice) {
    query += ` AND price <= $${i}`
    values.push(maxPrice)
    i++
  }

  if (sort === "new") {
    query += ` ORDER BY created_at DESC`
  } else if (sort === "price_asc") {
    query += ` ORDER BY price ASC`
  } else if (sort === "price_desc") {
    query += ` ORDER BY price DESC`
  }

  try {
    const res = await pool.query(query, values)
    return NextResponse.json(res.rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "DB error" }, { status: 500 })
  }
}