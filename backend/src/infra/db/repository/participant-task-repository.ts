import { PrismaClient } from '@prisma/client'
import { IParticipantTaskRepository } from 'src/app/sample/repository-interface/participant-task-repository-interface'
import { ParticipantTask } from 'src/domain/entity/participant-task'

export class ParticipantTaskRepository implements IParticipantTaskRepository {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async save(participantTask: ParticipantTask): Promise<ParticipantTask> {
    const { id, participantId, taskId, progress } = participantTask.getAllProperties()
    const savedParticipantTaskModel = await this.prismaClient.participantTask.create({
      data: {
        id,
        participantId,
        taskId,
        progress
      },
    });

    return ParticipantTask.reconstruct(savedParticipantTaskModel);
  }
}
