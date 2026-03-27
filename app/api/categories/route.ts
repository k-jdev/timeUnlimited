import { NextRequest, NextResponse } from "next/server"
import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from "@/lib/db"
import { requireAuth } from '@/lib/authHelpers';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const authResult = requireAuth(req);
    if (authResult instanceof Response) return authResult;

    const res2 = await pool.query("SELECT * FROM categories ORDER BY created_at DESC")
    return NextResponse.json(res2.rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, res: NextResponse) {

    const authResult = requireAuth(req);
    if (authResult instanceof Response) return authResult;

  try {
    const body = await req.json();
    if (!body.name || body.name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const result = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [body.name.trim()]
    )
    return NextResponse.json(result.rows[0])
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}