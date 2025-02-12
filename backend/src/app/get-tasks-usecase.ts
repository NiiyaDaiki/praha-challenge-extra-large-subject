import { ITaskQS } from './query-service-interface/tasks-qs'

export class GetTasksUseCase {
  private readonly tasksQS: ITaskQS
  public constructor(tasksQS: ITaskQS) {
    this.tasksQS = tasksQS
  }
  public async do() {
    try {
      return await this.tasksQS.getAll()
    } catch (error) {
      // memo: エラー処理
      throw error
    }
  }
}
