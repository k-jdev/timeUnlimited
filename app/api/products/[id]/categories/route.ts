import { pool } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request, context: { params: { id: string } }) {

  const { params } = context
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
  }

  try {
    const result = await pool.query(
      `
      SELECT c.*
      FROM categories c
      JOIN product_categories pc ON pc.category_id = c.id
      WHERE pc.product_id = $1
      `,
      [id]
    )

    return NextResponse.json(result.rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(req: Request, context: { params: { id: string } }) {

  const { params } = context
  const { id } = await params
  const { categoryIds } = await req.json()

  if (!id || !Array.isArray(categoryIds)) {
    return NextResponse.json(
      { error: "Product ID and categoryIds[] are required" },
      { status: 400 }
    )
  }

  try {

    await pool.query(
      `DELETE FROM product_categories WHERE product_id = $1`,
      [id]
    )

    for (const categoryId of categoryIds) {
      await pool.query(
        `INSERT INTO product_categories (product_id, category_id)
         VALUES ($1, $2)`,
        [id, categoryId]
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to link categories" },
      { status: 500 }
    )
  }
}
