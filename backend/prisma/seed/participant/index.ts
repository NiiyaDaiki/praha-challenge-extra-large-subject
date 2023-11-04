import { PrismaClient } from "@prisma/client"
import { createParticipantTestData } from "../../../testUtil/participant-data-factory";

export const seedParticipants = async (prisma: PrismaClient) => {
  // 10名のparticipantデータを作成し、それらをPromiseの配列に格納する
  const participantPromises = Array.from({ length: 10 }, async () => {
    const participantData = createParticipantTestData();
    return prisma.participant.create({
      data: participantData,
    });
  });

  // すべてのPromiseが完了するのを待つ
  await Promise.all(participantPromises);
  console.log("10 participants seeded");
}