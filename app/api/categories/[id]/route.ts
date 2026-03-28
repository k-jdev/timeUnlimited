import { NextResponse, NextRequest } from "next/server"
import { pool } from "@/lib/db"
import { requireAuth } from "@/lib/authHelpers"

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authResult = requireAuth(req)
  if (authResult instanceof Response) return authResult

  const { id } = await context.params

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 })
  }

  try {
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, deleted: result.rows[0] })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAuth(req)
  if (authResult instanceof Response) return authResult

  try {
    const { id } = await params
    const res = await pool.query("SELECT * FROM categories WHERE id = $1", [id])
    if (res.rowCount === 0)
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    return NextResponse.json(res.rows[0])
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    )
  }
}
