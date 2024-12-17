import { Pair } from '../domain/entity/pair';
import { ITeamRepository } from './repository-interface/team-repository-interface';

export class ReassignPairParticipantsUseCase {
  public constructor(
    private readonly teamRepo: ITeamRepository,
  ) {
    this.teamRepo = teamRepo
  }
  public async do(params: { id: string, pairs: Pair[] }) {
    console.log(`チーム${params.id}のペア情報を更新します`)

    // 引数で渡されたチームIDに紐づくチームを取得
    const team = await this.teamRepo.findById(params.id)
    if (!team) {
      throw new Error('チームが見つかりませんでした')
    }

    // 引数で渡されたペア情報を元に、チームに紐づくペア情報を更新
    team.reassignPairParticipants(params.pairs)
    this.teamRepo.save(team)

    console.log(`チーム${params.id}のペア情報を更新しました`)
  }
}
