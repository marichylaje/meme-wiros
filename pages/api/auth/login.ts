import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { signToken, setTokenCookie } from '../../../lib/auth'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[LOGIN] Request received', req.method, req.body);

  if (req.method !== 'POST') return res.status(405).end()

  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' })

  const token = signToken({ id: user.id, email: user.email })
  setTokenCookie(res, token)

  res.status(200).json({ message: 'Login exitoso', user: { id: user.id, email: user.email } })
}
