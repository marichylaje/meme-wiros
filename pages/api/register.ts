// pages/api/register.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()
const SECRET = process.env.JWT_SECRET!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { nombreColegio, nombreCurso, email, password, cantidad, anioEgreso } = req.body

  // Validaciones mínimas
  if (
    !nombreColegio?.trim() ||
    !nombreCurso?.trim() ||
    !email?.includes('@') ||
    !password ||
    isNaN(Number(cantidad)) ||
    isNaN(Number(anioEgreso))
  ) {
    return res.status(400).json({ error: 'Datos inválidos o incompletos' })
  }

  try {
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return res.status(409).json({ error: 'Email ya registrado' })
    }

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

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '7d' })

    return res.status(201).json({ message: 'Usuario registrado', token })
  } catch (error) {
    console.error('❌ Error en registro:', error)
    return res.status(500).json({ error: 'Error en el servidor' })
  }
}
