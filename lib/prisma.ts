// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Para evitar múltiples instancias en desarrollo
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
