import { PrismaClient } from '@prisma/client'
import { IParticipantRepository } from '../../../app/sample/repository-interface/participant-repository-interface'
import { Participant } from '../../../domain/entity/participant'
import { ParticipantTask } from '../../../domain/entity/participant-task'

export class ParticipantRepository implements IParticipantRepository {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async save(participantEntity: Participant): Promise<void> {
    const { id, name, email, status, tasks } = participantEntity.getAllProperties()

    await this.prismaClient.participant.upsert({
      where: { id },
      create: {
        id,
        name,
        email,
        status,
        participantTasks: {
          create: tasks.map(({ participantId: _participantId, ...rest }) => ({
            id: rest.id,
            taskId: rest.taskId,
            progress: rest.progress,
          }))
        },
        pairId: '1', // todo: とりあえず固定で1を入れている
      },
      update: {
        name,
        email,
        status,
      }

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

  // todo 参照系だが、qsに書かなくていいのか？ => ドメインを跨がないので、ここに書いてもいい
  public async findById(id: string): Promise<Participant | undefined> {
    const participantDataModel = await this.prismaClient.participant.findUnique({
      where: { id },
      include: { participantTasks: true }
    })

    if (!participantDataModel) {
      return undefined
    }

    // todo:エンティティに変換する処理はdomain層に移動する
    return Participant.reconstruct({
      ...participantDataModel,
      tasks: participantDataModel.participantTasks.map(pt =>
        ParticipantTask.reconstruct({
          id: pt.id,
          participantId: id,
          taskId: pt.taskId,
          progress: pt.progress,
        }),
      )
    })
  }

  public async delete(id: string): Promise<Participant | undefined> {
    const deletedParticipantModel = await this.prismaClient.participant.update({
      where: { id },
      data: {
        status: 'LEFT',
      }
    })
    if (!deletedParticipantModel) {
      return undefined
    }
  }
}