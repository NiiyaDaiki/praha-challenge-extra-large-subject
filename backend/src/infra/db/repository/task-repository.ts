import { PrismaClient } from '@prisma/client'
import { ITaskRepository } from '../../../app/repository-interface/task-repository-interface'
import { Task } from '../../../domain/entity/task/task'

export class TaskRepository implements ITaskRepository {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }
  public async findAll(): Promise<Task[]> {
    const tasks = await this.prismaClient.task.findMany()
    return tasks.map((task) => {
      return new Task({
        ...task
      })
    })
  }
}