import { NextApiRequest, NextApiResponse } from 'next'
import { getTokenFromReq, verifyToken } from '../../lib/auth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getTokenFromReq(req)
  if (!token) return res.status(401).json({ error: 'No autenticado' })

  const data = verifyToken(token)
  if (!data) return res.status(401).json({ error: 'Token inválido o expirado' })

  res.status(200).json({ user: data })
}
