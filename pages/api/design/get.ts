// pages/api/design/get.ts
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
  let decoded: any

  try {
    decoded = jwt.verify(token, JWT_SECRET)
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }

  try {
    const design = await prisma.design.findUnique({
      where: { userId: decoded.id }
    })

    if (!design) return res.status(404).json({ message: 'No hay diseño guardado' })

    res.status(200).json(design)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error del servidor' })
  }
}
