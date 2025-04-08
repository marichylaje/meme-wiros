// pages/api/admin/update-estado.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Estado } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { userId, estado } = req.body

  if (!userId || !estado) {
    return res.status(400).json({ error: 'Faltan datos' })
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { estado: estado as Estado },
    })

    return res.status(200).json({ message: 'Estado actualizado', user: updated })
  } catch (error) {
    console.error('Error al actualizar estado', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}
