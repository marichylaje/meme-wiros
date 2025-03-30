// pages/api/user/update.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Método no permitido' });

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const token = authHeader.split(' ')[1];

  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  const userId = decoded.id;
  const { nombreColegio, nombreCurso, cantidad, anioEgreso } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        nombreColegio,
        nombreCurso,
        cantidad: parseInt(cantidad),
        anioEgreso: parseInt(anioEgreso),
      },
    });

    res.status(200).json({ message: 'Perfil actualizado', user: updatedUser });
  } catch (err) {
    console.error('[UPDATE USER ERROR]', err);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
}
