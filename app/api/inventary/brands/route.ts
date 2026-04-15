import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET() {
  try {
    const res = await pool.query(
      `SELECT DISTINCT brand FROM products WHERE status = 'active' AND own = true AND brand IS NOT NULL ORDER BY brand ASC`
    )
    return NextResponse.json({
      brands: res.rows.map((r: { brand: string }) => r.brand),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ brands: [] }, { status: 500 })
  }
}
