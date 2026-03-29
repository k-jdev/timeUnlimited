import { NextResponse, NextRequest } from "next/server"
import { pool } from "@/lib/db"
import { requireAuth } from "@/lib/authHelpers"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAuth(req)
  if (authResult instanceof Response) return authResult

  const { id } = await params

  try {
    const result = await pool.query(
      `
      UPDATE products
      SET status = CASE
        WHEN status = 'active' THEN 'archived'
        WHEN status = 'archived' THEN 'active'
        ELSE status
      END,
      updated_at = NOW()
      WHERE id = $1
      RETURNING *
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}