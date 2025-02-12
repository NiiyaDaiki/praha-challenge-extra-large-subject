import { Participant } from '../../domain/entity/participant';

export interface IParticipantRepository {
  save(user: Participant): Promise<void>;
  findById(id: string): Promise<Participant | undefined>;
  findByEmail(email: string): Promise<Participant | undefined>;
  delete(id: string): Promise<Participant | undefined>;
}