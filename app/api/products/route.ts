import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const search = url.searchParams.get("search") ?? ""
  const status = url.searchParams.get("status") ?? "all"
  const page = Number(url.searchParams.get("page") ?? "1")
  const limit = Number(url.searchParams.get("limit") ?? "15")

  const offset = (page - 1) * limit

  let whereClause = "1=1"
  const values: any[] = []

  if (status !== "all") {
    values.push(status)
    whereClause += ` AND status=$${values.length}`
  }

  if (search) {
    values.push(`%${search}%`)
    whereClause += ` AND (brand ILIKE $${values.length} OR model ILIKE $${values.length})`
  }

  const query = `
    SELECT * FROM products
    WHERE ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${values.length + 1} OFFSET $${values.length + 2}
  `

  values.push(limit, offset)

  const res = await pool.query(query, values)
  return NextResponse.json(res.rows)
}