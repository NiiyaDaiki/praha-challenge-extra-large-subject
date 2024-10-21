// import { Participant, PrismaClient } from "@prisma/client"
// import { createParticipantTestData } from "../../../testUtil/participant-data-factory";
// import { Task } from "../../../src/domain/entity/task/task";
// import { createPairTestData } from "../../../testUtil/pair-data-factory";

// export const seedPairs = async (prisma: PrismaClient) => {
//   const participants = await prisma.participant.findMany({ include: { participantTasks: true } })
//   // const participantTasks = await prisma.participantTask.findMany()
//   // participants.map(participant => { 
//   //   participantTasks.map(participantTask => {
//   //     if(participant.id === participantTask.participantId) {
//   //     }
//   //   })
//   // })
//   // 3個のPairsデータを作成し、それらをPromiseの配列に格納する
//   const pairPromises = Array.from({ length: 3 }, async () => {
//     participants.map(participant => { 
//       const pairData = createPairTestData(participant);
//       return prisma.pair.create({
//         data: pairData,
//       });
//     })
//   });

//   // すべてのPromiseが完了するのを待つ
//   await Promise.all(pairPromises);
//   console.log("80 tasks seeded");
// }