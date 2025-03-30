import jwt from 'jsonwebtoken'
import { serialize, parse } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'

const SECRET = process.env.JWT_SECRET!

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

export function setTokenCookie(res: NextApiResponse, token: string) {
  const cookie = serialize('token', token, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    sameSite: 'lax'
  })

  res.setHeader('Set-Cookie', cookie)
}

export function getTokenFromReq(req: NextApiRequest): string | null {
  const cookies = parse(req.headers.cookie || '')
  return cookies.token || null
}
