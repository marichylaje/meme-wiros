import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { signToken, setTokenCookie } from '../../../lib/auth'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, password, nombreColegio, nombreCurso, cantidad, anioEgreso } = req.body

  const userExist = await prisma.user.findUnique({ where: { email } })
  if (userExist) return res.status(409).json({ error: 'Email ya registrado' })

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      nombreColegio,
      nombreCurso,
      cantidad: parseInt(cantidad),
      anioEgreso: parseInt(anioEgreso),
    }
  })

  const token = signToken({ id: user.id, email: user.email })
  setTokenCookie(res, token)

  res.status(201).json({ message: 'Registrado con éxito', user: { id: user.id, email: user.email } })
}
