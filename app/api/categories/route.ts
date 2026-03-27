import { NextResponse } from "next/server"
import { pool } from "@/lib/db" // твой pg Pool или prisma client

export async function GET() {
  try {
    const res = await pool.query("SELECT * FROM categories ORDER BY created_at DESC")
    return NextResponse.json(res.rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body.name || body.name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const res = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [body.name.trim()]
    )
    return NextResponse.json(res.rows[0])
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}