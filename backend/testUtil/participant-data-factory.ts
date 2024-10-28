import * as faker from 'faker'
import { Participant } from '../../backend/src/domain/entity/participant'
import { Task } from '../src/domain/entity/task/task'
import { getRandomChar } from '../src/util/random'

export const createParticipantTestData = (tasks: Task[]) => {

  return Participant.create({
    id: faker.random.uuid(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    tasks,
    pairId: getRandomChar('a', 'c'),
  })
}