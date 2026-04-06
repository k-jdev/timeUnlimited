import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./lib/auth"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Защита страниц /admin/*
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("token")?.value

    if (!token || !verifyToken(token)) {
      const loginUrl = new URL("/login", req.url)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  // Защита API /api/protected/*
  const token = req.headers.get("authorization")?.replace("Bearer ", "")

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = verifyToken(token)

  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/protected/:path*"],
}
