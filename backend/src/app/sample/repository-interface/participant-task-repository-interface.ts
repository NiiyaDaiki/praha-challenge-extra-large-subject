import { ParticipantTask } from '../../../domain/entity/participant-task';

export interface IParticipantTaskRepository {
  findOneByParticipantIdAndTaskId(participantId: string, taskId: string): Promise<ParticipantTask | undefined>;
  save(participantTask: ParticipantTask): Promise<ParticipantTask>;
}