import { NextRequest, NextResponse } from "next/server"
import { loginUser } from "@/lib/users"
import { signToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const user = await loginUser(email, password)

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = signToken(user)

  const response = NextResponse.json({ user, token })

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 дней
  })

  return response
}
