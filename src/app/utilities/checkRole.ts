import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function isTechLead(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  return user?.role === 'TECH_LEAD'
}
