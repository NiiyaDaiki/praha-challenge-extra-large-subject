import { PrismaClient } from '@prisma/client'
import { IParticipantRepository } from '../../../app/repository-interface/participant-repository-interface'
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

  public async findByEmail(email: string): Promise<Participant | undefined> {
    const participantDataModel = await this.prismaClient.participant.findUnique({
      where: { email },
      include: { participantTasks: true }
    })

    if (!participantDataModel) {
      return undefined
    }

    return Participant.reconstruct({
      ...participantDataModel,
      tasks: participantDataModel.participantTasks.map(pt =>
        ParticipantTask.reconstruct({
          id: pt.id,
          participantId: participantDataModel.id,
          taskId: pt.taskId,
          progress: pt.progress,
        }),
      )
    })
  }

  public async delete(id: string): Promise<Participant | undefined> {
    try {
      const deletedParticipantModel = await this.prismaClient.$transaction(async (prisma) => {
        // 関連する ParticipantTask を削除
        await prisma.participantTask.deleteMany({
          where: { participantId: id }
        });

        // Participant を削除
        const participant = await prisma.participant.delete({
          where: { id },
          include: { participantTasks: true }
        });
        return participant;
      });

      return Participant.reconstruct({
        ...deletedParticipantModel,
        tasks: deletedParticipantModel.participantTasks.map(pt =>
          ParticipantTask.reconstruct({
            id: pt.id,
            participantId: id,
            taskId: pt.taskId,
            progress: pt.progress,
          }),
        )
      }) || undefined;
    } catch (error) {
      console.error('participantとparticipantTask削除中にエラーが発生しました:', error)
      throw error
    }
  }

}