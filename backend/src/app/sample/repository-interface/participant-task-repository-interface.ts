import { ParticipantTask } from '../../../domain/entity/participant-task';

export interface IParticipantTaskRepository {
  save(participantTask: ParticipantTask): Promise<ParticipantTask>;
}