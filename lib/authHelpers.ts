// lib/authHelpers.ts
import { NextRequest } from "next/server"
import { verifyToken, type AuthTokenPayload } from "./auth"

export function requireAuth(req: NextRequest): AuthTokenPayload | Response {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    })
  }

  const user = verifyToken(token)

  if (!user || user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
    })
  }

  return user
}
