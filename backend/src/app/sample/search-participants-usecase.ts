import { IParticipantTasksQS } from './query-service-interface/participant-tasks-qs'

export class SearchParticipantsUseCase {
  private readonly participantTasksQS: IParticipantTasksQS
  public constructor(participantTasksQS: IParticipantTasksQS) {
    this.participantTasksQS = participantTasksQS
  }
  public async do(params: { taskIds: string[], progress: string, cursor?: string }) {
    try {
      return await this.participantTasksQS.search10ParticipantsByTaskProgress({ ...params })
    } catch (error) {
      // memo: エラー処理
      throw error
    }
  }
}
