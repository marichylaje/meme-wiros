import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { nombreColegio, nombreCurso, email, password } = req.body;

  if (!nombreColegio || !nombreCurso || !email || !password) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        nombreColegio,
        nombreCurso,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: 'Usuario creado con éxito', user: newUser });
  } catch (error) {
    console.error('Error registrando usuario:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
}
