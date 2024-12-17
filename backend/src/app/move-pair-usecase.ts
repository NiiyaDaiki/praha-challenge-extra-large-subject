import { TeamService } from '../domain/service/team-service';
import { ITeamRepository } from './repository-interface/team-repository-interface';

export class MovePairUseCase {
  public constructor(
    private readonly teamRepo: ITeamRepository,
  ) {
    this.teamRepo = teamRepo
  }
  public async do(params: { pairId: string, toTeamId: string }) {
    const service = new TeamService(this.teamRepo)
    await service.movePair(params.pairId, params.toTeamId)
  }
}
