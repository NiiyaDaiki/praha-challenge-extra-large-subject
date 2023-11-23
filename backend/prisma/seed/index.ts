import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({})
import { seedParticipants } from './participant'
import { seedTasks } from './task'
import { seedParticipantTasks } from './participantTask'

async function main() {
  await prisma.participantTask.deleteMany()
  await prisma.task.deleteMany()
  await prisma.participant.deleteMany()

  await seedParticipants(prisma)
  await seedTasks(prisma)
  await seedParticipantTasks(prisma)
}
main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })