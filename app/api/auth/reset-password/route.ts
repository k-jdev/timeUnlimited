import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"
import bcrypt from "bcrypt"

export async function POST(req: NextRequest) {
  const { email, code, newPassword } = await req.json()
  if (!email || !code || !newPassword) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const userRes = await pool.query(`SELECT id FROM users WHERE email = $1`, [email])
  if (userRes.rowCount === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const userId = userRes.rows[0].id

  const codeRes = await pool.query(
    `SELECT * FROM reset_codes WHERE user_id = $1 AND code = $2 AND used = false AND expires_at > NOW()`,
    [userId, code]
  )

  if (codeRes.rowCount === 0) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 })
  }

  const hashed = await bcrypt.hash(newPassword, 10)

  await pool.query(`UPDATE users SET password = $1 WHERE id = $2`, [hashed, userId])

  await pool.query(`UPDATE reset_codes SET used = true WHERE id = $1`, [codeRes.rows[0].id])

  return NextResponse.json({ message: "Password updated successfully" })
}