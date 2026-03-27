import { pool } from "@/lib/db"
import { NextResponse } from "next/server"


export async function DELETE(req: Request, context: { params: { productId: string, categoryId: string } }) {

  const { params } = context
  const { productId, categoryId} = await params  


  if (!productId || !categoryId) {
    return NextResponse.json({ error: "Product ID and Category ID are required" }, { status: 400 })
  }

  try {
    const result = await pool.query(
      `DELETE FROM product_categories WHERE product_id = $1 AND category_id = $2 RETURNING *`,
      [productId, categoryId]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, deleted: result.rows[0] })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to unlink category" }, { status: 500 })
  }
}