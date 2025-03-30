// pages/api/design/create.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado (sin token)' })
  }

  const token = authHeader.split(' ')[1]
  let decoded: any

  try {
    decoded = jwt.verify(token, JWT_SECRET)
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }

  const userId = decoded.id

  const {
    templateName,
    layerColors,
    customText,
    textColor,
    textPosition,
    fontFamily
  } = req.body

  try {
    const design = await prisma.design.create({
      data: {
        templateName,
        layerColors: JSON.stringify(layerColors),
        customText,
        textColor,
        textPosition: JSON.stringify(textPosition),
        fontFamily,
        colegioId: userId,
      },
    })

    return res.status(201).json({ message: 'Diseño guardado', design })
  } catch (err) {
    console.error('Error al crear diseño:', err)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}
