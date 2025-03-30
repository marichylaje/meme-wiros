// pages/api/auth/logout.ts
import { NextApiResponse, NextApiRequest } from 'next'
import { serialize } from 'cookie'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', serialize('token', '', {
    path: '/',
    expires: new Date(0),
  }))
  res.status(200).json({ message: 'Logout exitoso' })
}
