// pages/api/auth/register.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()
const SECRET = process.env.JWT_SECRET!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('[REGISTER] Request received', req.method, req.body);
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' }) // 👈 este responde 405
  }

  const { nombreColegio, nombreCurso, email, password, cantidad, anioEgreso, telefono } = req.body

  try {
    const userExists = await prisma.user.findUnique({ where: { email } })
    if (userExists) return res.status(409).json({ error: 'Email ya registrado' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        nombreColegio,
        nombreCurso,
        email,
        password: hashedPassword,
        cantidad: parseInt(cantidad),
        anioEgreso: parseInt(anioEgreso),
        telefono: telefono
      },
    })

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '7d' })

    res.status(201).json({ message: 'Registrado con éxito', token })
  } catch (err) {
    console.error('❌ Error en registro:', err)
    res.status(500).json({ error: 'Error del servidor' })
  }
}
