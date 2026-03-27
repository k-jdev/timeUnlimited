import { NextResponse } from "next/server"
import { pool } from "@/lib/db"


export async function DELETE(req: Request, context: { params: { id: string } }) {

   const { params } = context
  const { id } = await params 

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
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const res = await pool.query("SELECT * FROM categories WHERE id = $1", [id])
    if (res.rowCount === 0) return NextResponse.json({ error: "Category not found" }, { status: 404 })
    return NextResponse.json(res.rows[0])
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}