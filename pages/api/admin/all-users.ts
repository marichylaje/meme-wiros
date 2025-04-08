// pages/api/admin/all-users.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const allUsers = await prisma.user.findMany({
      include: {
        design: true
      }
    })

    res.status(200).json(allUsers)
  } catch (err) {
    console.error('Error cargando usuarios:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
