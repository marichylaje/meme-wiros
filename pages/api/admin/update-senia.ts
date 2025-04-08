import { PrismaClient } from '@prisma/client'
export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).end()

  const { userId, senia } = req.body
  const prisma = new PrismaClient()

  await prisma.user.update({
    where: { id: userId },
    data: { senia },
  })

  res.status(200).json({ message: 'Seña actualizada' })
}
