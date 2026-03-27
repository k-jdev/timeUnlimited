import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString() // 6-digit code
}

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })

  const userRes = await pool.query(`SELECT id FROM users WHERE email = $1`, [email])
  if (userRes.rowCount === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const code = generateCode()
  const userId = userRes.rows[0].id


  await pool.query(
    `INSERT INTO reset_codes (user_id, code, expires_at)
     VALUES ($1, $2, NOW() + interval '15 minutes')`,
    [userId, code]
  )

  console.log(`Verification code for ${email}: ${code}`)

  return NextResponse.json({ message: "Verification code sent" })
}