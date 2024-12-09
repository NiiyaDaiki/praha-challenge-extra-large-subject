import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({})
import { seedParticipants } from './participant'
import { seedTasks } from './task'
import { seedTeams } from './team'
import { seedPairs } from './pair'

async function main() {
  await prisma.team.deleteMany()
  await prisma.pair.deleteMany()
  await prisma.participantTask.deleteMany()
  await prisma.task.deleteMany()
  await prisma.participant.deleteMany()

  const tasks = await seedTasks(prisma)
  const teams = await seedTeams(prisma)
  const pairs = await seedPairs(prisma, teams)
  await seedParticipants(prisma, tasks, pairs)
}
main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })