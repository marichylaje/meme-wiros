// pages/api/auth/register.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const { nombreColegio, nombreCurso, email, password, cantidad, anioEgreso } = req.body;

    // Validaciones mínimas
    if (
      !nombreColegio?.trim() ||
      !nombreCurso?.trim() ||
      !email?.includes('@') ||
      !password ||
      isNaN(cantidad) ||
      isNaN(anioEgreso)
    ) {
      return res.status(400).json({ error: 'Datos inválidos o incompletos' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

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
        colegio: user.nombreColegio,
        curso: user.nombreCurso,
      },
    });
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
