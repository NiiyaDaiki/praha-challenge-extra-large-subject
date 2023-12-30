import { Participant } from 'src/domain/entity/participant';

export interface IParticipantRepository {
  save(user: Participant): Promise<Participant>;
}