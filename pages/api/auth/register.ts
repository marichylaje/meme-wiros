// pages/api/auth/register.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { nombreColegio, nombreCurso, email, password, cantidad, anioEgreso } = req.body;

  if (
    !nombreColegio?.trim() ||
    !nombreCurso?.trim() ||
    !email?.includes('@') ||
    !password ||
    isNaN(Number(cantidad)) ||
    isNaN(Number(anioEgreso))
  ) {
    return res.status(400).json({ error: 'Datos inválidos o incompletos' });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: 'Email ya registrado' });

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      nombreColegio,
      nombreCurso,
      email,
      password: hashed,
      cantidad: parseInt(cantidad),
      anioEgreso: parseInt(anioEgreso),
    },
  });

  return res.status(201).json({
    message: 'Usuario creado exitosamente',
    user: {
      id: user.id,
      email: user.email,
    },
  });
}
