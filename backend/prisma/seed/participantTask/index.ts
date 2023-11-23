import { PrismaClient } from "@prisma/client"
import * as faker from 'faker'

export const seedParticipantTasks = async (prisma: PrismaClient) => {
  // 参加者とタスクのIDを取得
  const participants = await prisma.participant.findMany();
  const tasks = await prisma.task.findMany();

  // 参加者とタスクをマッピングする
  const participantTasks = participants.flatMap(participant =>
    tasks.map(task => ({
      id: faker.random.uuid(),
      participantId: participant.id,
      taskId: task.id,
    }))
  );

  // データベースにParticipantTaskを保存
  for (const pt of participantTasks) {
    await prisma.participantTask.create({
      data: pt,
    });
  }

  console.log(`${participantTasks.length} participant tasks seeded`);
};
