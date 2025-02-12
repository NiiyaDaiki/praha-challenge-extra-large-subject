import { IParticipantsQS } from './query-service-interface/participants-qs'

export class GetParticipantsUseCase {
  private readonly participantQS: IParticipantsQS
  public constructor(participantQS: IParticipantsQS) {
    this.participantQS = participantQS
  }
  public async do() {
    try {
      return await this.participantQS.getAll()
    } catch (error) {
      // memo: エラー処理
      throw error
    }
  }
}
