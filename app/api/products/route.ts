import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { requireAuth } from "@/lib/authHelpers";


export async function GET(req: NextRequest) {

  const authResult = requireAuth(req);
  if (authResult instanceof Response) return authResult;

  try {
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
      whereClause += ` AND status = $${values.length}`
    }

    if (search) {
      values.push(`%${search}%`)
      whereClause += ` AND (brand ILIKE $${values.length} OR model ILIKE $${values.length})`
    }

    // --- Count total ---
    const countQuery = `SELECT COUNT(*) AS total FROM products WHERE ${whereClause}`
    const countRes = await pool.query(countQuery, values)
    const total = Number(countRes.rows[0].total)

    // --- Fetch products page ---
    const productQuery = `
      SELECT * FROM products
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `
    values.push(limit, offset)
    const productsRes = await pool.query(productQuery, values)
    const products = productsRes.rows

    if (products.length === 0) {
      return NextResponse.json({ products: [], total })
    }

    const productIds = products.map(p => p.id)
    const imagesRes = await pool.query(
      `SELECT * FROM product_images 
       WHERE product_id = ANY($1::uuid[])
       ORDER BY created_at DESC`,
      [productIds]
    )

    const imagesMap: Record<string, any[]> = {}
    imagesRes.rows.forEach(img => {
      if (!imagesMap[img.product_id]) imagesMap[img.product_id] = []
      imagesMap[img.product_id].push(img)
    })

    const productsWithImages = products.map(p => ({
      ...p,
      images: imagesMap[p.id] || []
    }))

    return NextResponse.json({ products: productsWithImages, total })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}