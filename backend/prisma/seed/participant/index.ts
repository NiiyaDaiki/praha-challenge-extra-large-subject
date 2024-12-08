import { PrismaClient } from "@prisma/client"
import { createParticipantTestData } from "../../../testUtil/participant-data-factory";
import { Task } from "../../../src/domain/entity/task/task";

export const seedParticipants = async (prisma: PrismaClient, tasks: Task[]) => {
  // 3名のparticipantデータを作成し、それらをPromiseの配列に格納する
  const participantPromises = Array.from({ length: 6 }, async () => {
    const participantData = createParticipantTestData(tasks);
    return prisma.participant.create({
      data: {
        id: participantData.id,
        name: participantData.name,
        email: participantData.email,
        status: participantData.status,
        pairId: '1', // とりあえず固定で1を入れている
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
  return await Promise.all(participantPromises).then((participant) => {
    console.log("6 participants seeded");
    return participant;
  });
}