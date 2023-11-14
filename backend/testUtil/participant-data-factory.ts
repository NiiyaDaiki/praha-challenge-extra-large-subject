import * as faker from 'faker'
import { Participant } from '../../backend/src/domain/entity/participant'

export const createParticipantTestData = () => {
  return Participant.create({
    id: faker.random.uuid(),
    name: faker.name.findName(),
    email: faker.internet.email(),
  })
}