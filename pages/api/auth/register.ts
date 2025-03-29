// pages/api/auth/register.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const { nombreColegio, nombreCurso, email, password, cantidad, anioEgreso } = req.body;

    if (!nombreColegio || !nombreCurso || !email || !password || !cantidad || !anioEgreso)
      return res.status(400).json({ error: 'Faltan campos requeridos' });

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists)
      return res.status(409).json({ error: 'Email ya registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nombreColegio,
        nombreCurso,
        email,
        password: hashedPassword,
        cantidad: parseInt(cantidad),
        anioEgreso: parseInt(anioEgreso),
      },
    });

    return res.status(201).json({ message: 'Usuario creado exitosamente', user });
  } catch (err) {
    console.error('Error en registro:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
