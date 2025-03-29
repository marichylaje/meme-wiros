// pages/api/design/create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const token = await getToken({ req, secret: JWT_SECRET });
  if (!token || !token.id) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const userId = token.id as string;

  const {
    templateName,
    layerColors,
    customText,
    textColor,
    textPosition,
    fontFamily
  } = req.body;

  try {
    const design = await prisma.design.create({
      data: {
        templateName,
        layerColors: JSON.stringify(layerColors),
        customText,
        textColor,
        textPosition: JSON.stringify(textPosition),
        fontFamily,
        colegioId: userId,
      },
    });

    return res.status(201).json({ message: 'Diseño guardado', design });
  } catch (err) {
    console.error('Error al crear diseño:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
