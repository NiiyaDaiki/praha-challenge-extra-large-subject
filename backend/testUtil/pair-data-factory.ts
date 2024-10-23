// import * as faker from 'faker'
// import { getRandomChar } from '../src/util/random';
// import { Pair } from '../src/domain/entity/pair';
// import { Participant } from '@prisma/client';
// import { Participant as ParticipantDomain} from '../src/domain/entity/participant';

// export const createPairTestData = (participant: Participant) => {
  
//   const pairId = faker.random.uuid();
//   const pairName = getRandomChar('a', 'c');


//     ParticipantDomain.reconstruct({
//       id: participant.id,
//       name: participant.name,
//       email: participant.email,
//       pairId: pairId,
//       status: participant.status,
//       tasks: participant.participantTasks
//       // status: participant.status,

//   })

//   return new Pair({
//     id: faker.random.uuid(),
//     name: pairName,
//     participants: participants
//   })
// }