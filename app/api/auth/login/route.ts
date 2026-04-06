import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/users";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await loginUser(email, password);

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signToken(user);

  return NextResponse.json({ user, token });
}