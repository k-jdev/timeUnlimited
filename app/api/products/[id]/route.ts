import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const body = await req.json()
  const {
    brand,
    model,
    price,
    referenceNumber,
    description,
    condition,
    caseMaterial,
    caseSize,
    dial,
    hoverColor,
  } = body

  const query = `
    UPDATE products
    SET brand=$1, model=$2, price=$3, reference_number=$4,
        description=$5, condition=$6, case_material=$7,
        case_size=$8, dial=$9, hover_color=$10, updated_at=NOW()
    WHERE id=$11
    RETURNING *
  `
  const values = [
    brand,
    model,
    price,
    referenceNumber,
    description,
    condition,
    caseMaterial,
    caseSize,
    dial,
    hoverColor,
    id,
  ]

  try {
    const result = await pool.query(query, values)
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(result.rows[0])
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest, context: { params: any }) {

  const { params } = context
  const { id } = await params   


  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id])
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(result.rows[0])
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

