import { PrismaClient } from "@prisma/client"
import { createParticipantTestData } from "../../../testUtil/participant-data-factory";
import { Task } from "../../../src/domain/entity/task/task";

export const seedParticipants = async (prisma: PrismaClient, tasks: Task[]) => {
  // 3名のparticipantデータを作成し、それらをPromiseの配列に格納する
  const participantPromises = Array.from({ length: 3 }, async () => {
    const participantData = createParticipantTestData(tasks);
    return prisma.participant.create({
      data: {
        id: participantData.id,
        name: participantData.name,
        email: participantData.email,
        status: participantData.status,
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

  // すべてのPromiseが完了するのを待つ
  await Promise.all(participantPromises);
  console.log("10 participants seeded");
}