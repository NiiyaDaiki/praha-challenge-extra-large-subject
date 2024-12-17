import { ITeamsQS } from './query-service-interface/teams-qs'

export class GetTeamsUseCase {
  private readonly teamsQS: ITeamsQS
  public constructor(teamsQS: ITeamsQS) {
    this.teamsQS = teamsQS
  }
  public async do() {
    try {
      return await this.teamsQS.getAll()
    } catch (error) {
      // memo: エラー処理
      throw error
    }
  }
}
