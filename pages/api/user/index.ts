// pages/api/user/index.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' })

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const userId = decoded.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { design: true },
    })

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    res.status(200).json(user)
  } catch (err) {
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}
