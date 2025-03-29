// pages/api/auth/register.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET!;

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const { nombreColegio, nombreCurso, email, password, cantidad, anioEgreso } = req.body;

    // Validaciones básicas
    if (!nombreColegio || !nombreCurso || !email || !password || !cantidad || !anioEgreso) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    const parsedCantidad = parseInt(cantidad);
    const parsedAnio = parseInt(anioEgreso);

    if (isNaN(parsedCantidad) || parsedCantidad < 5 || parsedCantidad > 100) {
      return res.status(400).json({ error: 'Cantidad debe estar entre 5 y 100' });
    }

    if (isNaN(parsedAnio) || parsedAnio <= new Date().getFullYear()) {
      return res.status(400).json({ error: 'Año de egreso debe ser mayor al actual' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email ya registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nombreColegio,
        nombreCurso,
        email,
        password: hashedPassword,
        cantidad: parsedCantidad,
        anioEgreso: parsedAnio,
      },
    });
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '7d' });

    console.log({user})
    console.log({token})
    return res.status(201).json({
      message: 'Registro exitoso',
      user: {
        id: user.id,
        email: user.email,
        colegio: user.nombreColegio,
        curso: user.nombreCurso,
      },
      token
    });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}
