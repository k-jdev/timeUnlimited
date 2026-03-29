// lib/authHelpers.ts
import { NextRequest } from 'next/server';
import { verifyToken } from './auth';

export function requireAuth(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const user = verifyToken(token) as any;

  if (!user|| user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
  }

  return user; 
}