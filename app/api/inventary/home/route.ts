import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import type { DBProduct } from "@/lib/mapProduct"
import type { ProductImage } from "@/types/image"

export async function GET() {
  try {
    const productsRes = await pool.query<DBProduct>(
      `SELECT * FROM products
       WHERE status = 'active' AND show_on_main = TRUE
       ORDER BY show_order ASC`
    )
    const products = productsRes.rows

    if (products.length === 0) {
      return NextResponse.json({ products: [] })
    }

    const productIds = products.map((p) => p.id)
    const imagesRes = await pool.query<ProductImage>(
      `SELECT * FROM product_images
       WHERE product_id = ANY($1::uuid[])
       ORDER BY created_at DESC`,
      [productIds]
    )

    const imagesMap: Record<string, ProductImage[]> = {}
    imagesRes.rows.forEach((img) => {
      if (!imagesMap[img.product_id]) imagesMap[img.product_id] = []
      imagesMap[img.product_id].push(img)
    })

    const productsWithImages = products.map((p) => ({
      ...p,
      images: imagesMap[p.id] || [],
    }))

    return NextResponse.json({ products: productsWithImages })
  } catch (err) {
    console.error(err)
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json(
      { error: "DB error", details: message },
      { status: 500 }
    )
  }
}
