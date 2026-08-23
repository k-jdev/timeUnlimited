import jwt from "jsonwebtoken"
import type { SafeUser } from "@/types/user"

/** Claims carried inside the app's JWTs. */
export type AuthTokenPayload = SafeUser

const JWT_SECRET = process.env.JWT_SECRET!

export function signToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload
  } catch {
    return null
  }
}
