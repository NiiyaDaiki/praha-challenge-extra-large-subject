import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({})
import { seedParticipants } from './participant'

async function main() {
  await seedParticipants(prisma)
}
main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })