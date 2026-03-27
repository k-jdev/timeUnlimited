import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/users";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = await createUser(email, password);
  const token = signToken(user);

  return NextResponse.json({ user, token });
}