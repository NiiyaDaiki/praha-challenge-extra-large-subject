import { PrismaClient } from '@prisma/client'

import { Progress } from '../../../../domain/entity/task/progress';
import { IParticipantTasksQS, SearchParticipantTasksDTO } from '../../../../app/sample/query-service-interface/participant-tasks-qs';

export class ParticipantTasksQS implements IParticipantTasksQS {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  // 特定の課題（複数可能）が特定の進捗ステータスになっている参加者を10人単位でページングして取得する
  public async search10ParticipantsByTaskProgress(params: { taskIds: string[]; progress: Progress; cursor?: string; }): Promise<SearchParticipantTasksDTO[]> {
    // 動的にクエリを組み立てようとすると、Prismaの型定義がうまく機能しないため、cursorがあるかどうかでクエリを分岐させる
    if (typeof params.cursor === 'string') {
      const participantTasks = await this.prismaClient.participantTask.findMany({
        include: {
          participant: true,
          task: true
        },
        where: {
          AND: {
            taskId: {
              in: params.taskIds,
            },
            progress: {
              equals: params.progress,
            },
          },
        },
        skip: 1,
        cursor: {
          id: params.cursor
        },
        take: 10,
        orderBy: [
          { id: 'asc' },
          { participantId: 'asc' }
        ]
      })
      return participantTasks.map(
        (participantTasks) =>
          new SearchParticipantTasksDTO({
            id: participantTasks.id,
            progress: participantTasks.progress,
            task: {
              id: participantTasks.task.id,
              genre: participantTasks.task.genre,
              title: participantTasks.task.title,
            },
            participant: {
              id: participantTasks.participant.id,
              name: participantTasks.participant.name,
              status: participantTasks.participant.status
            }
          }),
      )
    } else {
      const participantTasks = await this.prismaClient.participantTask.findMany({
        include: {
          participant: true,
          task: true
        },
        where: {
          AND: {
            taskId: {
              in: params.taskIds,
            },
            progress: {
              equals: params.progress,
            },
          },
        },
        take: 10,
        orderBy: [
          { id: 'asc' },
          { participantId: 'asc' }
        ]
      })

      return participantTasks.map(
        (participantTasks) =>
          new SearchParticipantTasksDTO({
            id: participantTasks.id,
            progress: participantTasks.progress,
            task: {
              id: participantTasks.task.id,
              genre: participantTasks.task.genre,
              title: participantTasks.task.title,
            },
            participant: {
              id: participantTasks.participant.id,
              name: participantTasks.participant.name,
              status: participantTasks.participant.status
            }
          }),
      )
    }
  }
}
