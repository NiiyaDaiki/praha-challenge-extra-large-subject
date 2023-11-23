import { ParticipantTask } from 'src/domain/entity/participant-task';

export interface IParticipantTaskRepository {
  save(participantTask: ParticipantTask): Promise<ParticipantTask>;
}