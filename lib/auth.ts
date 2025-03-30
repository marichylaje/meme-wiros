// lib/auth.ts
import jwt from 'jsonwebtoken'
import { NextApiResponse, NextApiRequest } from 'next'

const SECRET = process.env.JWT_SECRET!

// Firmar un token
export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

// Verificar un token
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

// Extraer token de cookies (para endpoints protegidos)
export function getTokenFromReq(req: NextApiRequest): string | null {
  const cookie = req.headers.cookie
  if (!cookie) return null

  const token = cookie
    .split(';')
    .find((c) => c.trim().startsWith('token='))
    ?.split('=')[1]

  return token || null
}

// Setear token en cookie
export function setTokenCookie(res: NextApiResponse, token: string) {
  res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`)
}
