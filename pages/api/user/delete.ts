// pages/api/user/delete.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Método no permitido' })

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const userId = decoded.id

    // Eliminar primero el diseño (si existe)
    await prisma.design.deleteMany({ where: { userId } })

    // Luego eliminar al usuario
    await prisma.user.delete({ where: { id: userId } })

    res.status(200).json({ message: 'Cuenta eliminada correctamente' })
  } catch (err) {
    res.status(500).json({ error: 'No se pudo eliminar la cuenta' })
  }
}
