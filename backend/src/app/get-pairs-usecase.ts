import { IPairsQS } from './query-service-interface/pairs-qs'

export class GetPairsUseCase {
  private readonly pairsQS: IPairsQS
  public constructor(pairsQS: IPairsQS) {
    this.pairsQS = pairsQS
  }
  public async do() {
    try {
      return await this.pairsQS.getAll()
    } catch (error) {
      // memo: エラー処理
      throw error
    }
  }
}
