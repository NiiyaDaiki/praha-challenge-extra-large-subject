import { PrismaClient } from '@prisma/client'
import { ITaskQS, TaskDTO } from '../../../app/query-service-interface/tasks-qs'


export class TaskQS implements ITaskQS {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async getAll(): Promise<TaskDTO[]> {
    const allTasks = await this.prismaClient.task.findMany()
    return allTasks.map(
      (task) =>
        new TaskDTO({
          ...task,
        }),
    )
  }
}
