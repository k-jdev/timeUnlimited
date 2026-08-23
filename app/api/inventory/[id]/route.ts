import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const productRes = await pool.query(
      "SELECT * FROM products WHERE id = $1 AND status = 'active'",
      [id]
    )

    if (productRes.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const product = productRes.rows[0]

    const imagesRes = await pool.query(
      `SELECT * FROM product_images WHERE product_id = $1 ORDER BY created_at DESC`,
      [id]
    )

    return NextResponse.json({
      ...product,
      images: imagesRes.rows,
    })
  } catch (err) {
    console.error(err)
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json(
      { error: "DB error", details: message },
      { status: 500 }
    )
  }
}
