import { PrismaClient } from '@prisma/client'
import { IParticipantRepository } from '../../../app/sample/repository-interface/participant-repository-interface'
import { Participant } from '../../../domain/entity/participant'

export class ParticipantRepository implements IParticipantRepository {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async save(participantEntity: Participant): Promise<void> {
    const { id, name, email, status, tasks } = participantEntity.getAllProperties()

    await this.prismaClient.participant.create({
      data: {
        id,
        name,
        email,
        status,
        participantTasks: {
          create: tasks.map(task => ({ ...task }))
        }
      },
    })

    // todo:保存操作の結果を、エンティティに変換して返すにはどうしたらいい？ 使わなければ返す必要ないか。
    // const savedSomeDataEntity = Participant.reconstruct({
    //   ...savedParticipantDataModel,
    //   participantTasks: savedParticipantDataModel.participantTasks.map(pt => ({
    //     id: pt.id,
    //     participantId: id,
    //     taskId: pt.taskId,
    //     progress: pt.progress,
    //   })),
    // })
    // return savedSomeDataEntity
  }
}
