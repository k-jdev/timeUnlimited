import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const productsRes = await pool.query(
      `SELECT * FROM products
       WHERE status = 'active' AND show_on_main = TRUE
       ORDER BY show_order ASC`
    )
    const products = productsRes.rows

    if (products.length === 0) {
      return NextResponse.json({ products: [] })
    }

    const productIds = products.map((p: any) => p.id)
    const imagesRes = await pool.query(
      `SELECT * FROM product_images
       WHERE product_id = ANY($1::uuid[])
       ORDER BY created_at DESC`,
      [productIds]
    )

    const imagesMap: Record<string, any[]> = {}
    imagesRes.rows.forEach((img: any) => {
      if (!imagesMap[img.product_id]) imagesMap[img.product_id] = []
      imagesMap[img.product_id].push(img)
    })

    const productsWithImages = products.map((p: any) => ({
      ...p,
      images: imagesMap[p.id] || [],
    }))

    return NextResponse.json({ products: productsWithImages })
  } catch (err) {
    console.error(err)
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: "DB error", details: message }, { status: 500 })
  }
}
