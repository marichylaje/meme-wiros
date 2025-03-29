// pages/api/users/register.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  const { nombreColegio, nombreCurso, email, password, cantidad, anioEgreso } = req.body

  if (!email || !password || !nombreColegio || !nombreCurso || !cantidad || !anioEgreso)
    return res.status(400).json({ error: 'Campos obligatorios' })

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return res.status(409).json({ error: 'Email ya registrado' })

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      nombreColegio,
      nombreCurso,
      email,
      password: hashedPassword,
      cantidad: parseInt(cantidad),
      anioEgreso: parseInt(anioEgreso),
    },
  })

  return res.status(201).json({ message: 'Registrado correctamente', user: { id: user.id, email: user.email } })
}
