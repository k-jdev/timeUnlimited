import { pool } from "./db";
import bcrypt from "bcrypt";
import { User, SafeUser } from "@/types/user";

export async function createUser(
  email: string,
  password: string
): Promise<SafeUser> {
  const hashed = await bcrypt.hash(password, 10);

  const result = await pool.query<SafeUser>(
    `INSERT INTO users (email, password)
     VALUES ($1, $2)
     RETURNING id, email, role`,
    [email, hashed]
  );

  return result.rows[0];
}

export async function loginUser(
  email: string,
  password: string
): Promise<SafeUser | null> {
  const result = await pool.query<User>(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  const user = result.rows[0];
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}