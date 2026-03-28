import { pool } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"
import { requireAuth } from "@/lib/authHelpers"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; categoryId: string }> }
) {
  const authResult = requireAuth(req)
  if (authResult instanceof Response) return authResult

  const { id, categoryId } = await params

  if (!id || !categoryId) {
    return NextResponse.json(
      { error: "Product ID and Category ID are required" },
      { status: 400 }
    )
  }

  try {
    const result = await pool.query(
      `DELETE FROM product_categories WHERE product_id = $1 AND category_id = $2 RETURNING *`,
      [id, categoryId]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, deleted: result.rows[0] })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to unlink category" },
      { status: 500 }
    )
  }
}
