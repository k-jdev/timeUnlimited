import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const search = searchParams.get("search")
  const brand = searchParams.get("brand")
  const condition = searchParams.get("condition")
  const caseMaterial = searchParams.get("caseMaterial")
  const dialColor = searchParams.get("dialColor")
  const size = searchParams.get("size")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const sort = searchParams.get("sort") || "new"
  const page = Number(searchParams.get("page") ?? "1")
  const limit = Number(searchParams.get("limit") ?? "100")
  const offset = (page - 1) * limit

  let whereClause = `status = 'active' AND own = false`
  const values: any[] = []
  let i = 1

  if (search) {
    whereClause += ` AND (brand ILIKE $${i} OR model ILIKE $${i} OR reference_number ILIKE $${i})`
    values.push(`%${search}%`)
    i++
  }
  if (brand) {
    whereClause += ` AND brand = $${i}`
    values.push(brand)
    i++
  }
  if (condition) {
    whereClause += ` AND condition = $${i}`
    values.push(condition)
    i++
  }
  if (caseMaterial) {
    whereClause += ` AND case_material = $${i}`
    values.push(caseMaterial)
    i++
  }
  if (dialColor) {
    whereClause += ` AND dial_color = $${i}`
    values.push(dialColor)
    i++
  }
  if (size) {
    whereClause += ` AND case_size = $${i}`
    values.push(size)
    i++
  }
  if (minPrice) {
    whereClause += ` AND price >= $${i}`
    values.push(minPrice)
    i++
  }
  if (maxPrice) {
    whereClause += ` AND price <= $${i}`
    values.push(maxPrice)
    i++
  }

  let orderClause = "ORDER BY created_at DESC"
  if (sort === "price_asc") orderClause = "ORDER BY price ASC NULLS LAST"
  else if (sort === "price_desc") orderClause = "ORDER BY price DESC NULLS LAST"

  try {
    const countValues = [...values]
    const [countRes, productsRes] = await Promise.all([
      pool.query(`SELECT COUNT(*) AS total FROM products WHERE ${whereClause}`, countValues),
      pool.query(
        `SELECT * FROM products WHERE ${whereClause} ${orderClause} LIMIT $${i} OFFSET $${i + 1}`,
        [...values, limit, offset]
      ),
    ])

    const total = Number(countRes.rows[0].total)
    const products = productsRes.rows

    if (products.length === 0) {
      return NextResponse.json({ products: [], total })
    }

    const productIds = products.map((p: any) => p.id)
    const imagesRes = await pool.query(
      `SELECT * FROM product_images WHERE product_id = ANY($1::uuid[]) ORDER BY created_at DESC`,
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

    return NextResponse.json({ products: productsWithImages, total })
  } catch (err) {
    console.error(err)
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: "DB error", details: message }, { status: 500 })
  }
}
