import { PrismaClient } from '@prisma/client'
import { IParticipantTaskRepository } from '../../../app/repository-interface/participant-task-repository-interface'
import { ParticipantTask } from '../../../domain/entity/participant-task'

export class ParticipantTaskRepository implements IParticipantTaskRepository {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findOneByParticipantIdAndTaskId(participantId: string, taskId: string): Promise<ParticipantTask | undefined> {
    const participantTaskDataModel = await this.prismaClient.participantTask.findUnique({
      where: {
        participantId_taskId: {
          participantId,
          taskId
        }
      }
    });
    if (!participantTaskDataModel) return undefined

    return ParticipantTask.reconstruct({
      id: participantTaskDataModel.id,
      participantId: participantTaskDataModel.participantId,
      taskId: participantTaskDataModel.taskId,
      progress: participantTaskDataModel.progress
    })
  }

  public async save(participantTask: ParticipantTask): Promise<ParticipantTask> {
    const { id, participantId, taskId, progress } = participantTask.getAllProperties()
    const savedParticipantTaskModel = await this.prismaClient.participantTask.update({
      where: { id },
      data: {
        participantId,
        taskId,
        progress
      }
    })
    return ParticipantTask.reconstruct(savedParticipantTaskModel);
  }
}
