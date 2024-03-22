import { PrismaClient } from "@prisma/client"
import { createTaskTestData } from "../../../testUtil/task-data-factory";

export const seedTasks = async (prisma: PrismaClient) => {
  // 80個のTaskデータを作成し、それらをPromiseの配列に格納する
  const taskPromises = Array.from({ length: 80 }, async () => {
    const taskData = createTaskTestData();
    return prisma.task.create({
      data: taskData,
    });
  });

  // すべてのPromiseが完了するのを待つ
  await Promise.all(taskPromises);
  console.log("80 tasks seeded");
}