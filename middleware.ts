import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/protected/:path*"],
};