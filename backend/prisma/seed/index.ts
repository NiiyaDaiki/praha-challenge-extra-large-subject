import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({})
import { seedParticipants } from './participant'
import { seedTasks } from './task'
import { seedParticipantTasks } from './participantTask'
import { Task } from '../../src/domain/entity/task/task'

async function main() {
  await prisma.participantTask.deleteMany()
  await prisma.task.deleteMany()
  await prisma.participant.deleteMany()

  await seedTasks(prisma)
  const rawTasks = await prisma.task.findMany()
  const tasks = rawTasks.map(rawTask => new Task(rawTask))
  await seedParticipants(prisma, tasks)
  await seedParticipantTasks(prisma)
}
main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })