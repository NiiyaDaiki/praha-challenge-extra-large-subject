import { Pair, PrismaClient } from "@prisma/client"
import { createParticipantTestData } from "../../../testUtil/participant-data-factory";
import { Task } from "../../../src/domain/entity/task/task";

export const seedParticipants = async (prisma: PrismaClient, tasks: Task[], prismaPairs: Pair[]) => {

  const pairAParticipantPromises = Array.from({ length: 3 }, async () => {
    const participantData = createParticipantTestData(tasks);
    return prisma.participant.create({
      data: {
        id: participantData.id,
        name: participantData.name,
        email: participantData.email,
        status: participantData.status,
        pairId: prismaPairs[0]?.id,
        participantTasks: {
          create: participantData.participantTasks.map((task) => ({
            id: task.id,
            progress: task.progress,
            taskId: task.taskId
          })),
        },
      },
    });
  });
  const pairBParticipantPromises = Array.from({ length: 2 }, async () => {
    const participantData = createParticipantTestData(tasks);
    return prisma.participant.create({
      data: {
        id: participantData.id,
        name: participantData.name,
        email: participantData.email,
        status: participantData.status,
        pairId: prismaPairs[1]?.id,
        participantTasks: {
          create: participantData.participantTasks.map((task) => ({
            id: task.id,
            progress: task.progress,
            taskId: task.taskId
          })),
        },
      },
    });
  });
  const pairCParticipantPromises = Array.from({ length: 2 }, async () => {
    const participantData = createParticipantTestData(tasks);
    return prisma.participant.create({
      data: {
        id: participantData.id,
        name: participantData.name,
        email: participantData.email,
        status: participantData.status,
        pairId: prismaPairs[2]?.id,
        participantTasks: {
          create: participantData.participantTasks.map((task) => ({
            id: task.id,
            progress: task.progress,
            taskId: task.taskId
          })),
        },
      },
    });
  });
  const pairDParticipantPromises = Array.from({ length: 2 }, async () => {
    const participantData = createParticipantTestData(tasks);
    return prisma.participant.create({
      data: {
        id: participantData.id,
        name: participantData.name,
        email: participantData.email,
        status: participantData.status,
        pairId: prismaPairs[3]?.id,
        participantTasks: {
          create: participantData.participantTasks.map((task) => ({
            id: task.id,
            progress: task.progress,
            taskId: task.taskId
          })),
        },
      },
    });
  });

  const allParticipantPromises = [...pairAParticipantPromises, ...pairBParticipantPromises, ...pairCParticipantPromises, ...pairDParticipantPromises];
  // すべてのPromiseが完了するのを待つ
  return await Promise.all(allParticipantPromises).then((participant) => {
    console.log(`${allParticipantPromises.length} participants seeded`);
    return participant;
  });
}