// pages/api/auth/login.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()
const SECRET_KEY = process.env.JWT_SECRET!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) return res.status(401).json({ error: 'Usuario no encontrado' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' })

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '7d' })
  console.log({user})
  console.log({valid})
  console.log({token})
  res.status(200).json({ message: 'Login exitoso', token })
}
