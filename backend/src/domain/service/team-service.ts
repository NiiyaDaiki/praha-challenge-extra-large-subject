import { Team } from '../entity/team';
import { ITeamRepository } from '../../app/repository-interface/team-repository-interface';

export class TeamService {

  constructor(private readonly teamRepo: ITeamRepository) {
    this.teamRepo = teamRepo;
  }

  public async findTeamWithLeastParticipants(): Promise<Team[]> {
    console.log('最小の参加者数を持つチームを取得します');
    const teams = await this.teamRepo.findAll();

    // 最小の参加者数を計算
    const minParticipantCount = Math.min(
      ...teams.map(team => team.getTotalParticipantCount())
    );

    // 最小の参加者数を持つチームをフィルタリング
    const minTeams = teams.filter(
      team => team.getTotalParticipantCount() === minParticipantCount
    );

    console.log(`最小の参加者数を持つチーム: ${minTeams.map(team => team.name)}`);
    return minTeams;
  }

  public async movePair(pairId: string, toTeamId: string): Promise<void> {
    console.log(`ペア:${pairId}をチーム${toTeamId}に移動します`);

    // 所属元チームを取得
    const oldTeam = await this.teamRepo.findByPairId(pairId);
    console.log('oldTeam', oldTeam?.getAllProperties().pairs)
    if (!oldTeam) {
      throw new Error('所属元チームが見つかりませんでした');
    }

    // 移動先チームを取得
    const toTeam = await this.teamRepo.findById(toTeamId);
    console.log('toTeam', toTeam?.getAllProperties().pairs)
    if (!toTeam) {
      throw new Error('移動先チームが見つかりませんでした');
    }

    // ペアを移動
    const pair = oldTeam.getPair(pairId)
    oldTeam.deletePair(pairId);
    toTeam.addPair(pair);

    await this.teamRepo.save(oldTeam);
    await this.teamRepo.save(toTeam);

    console.log(`ペア:${pairId}をチーム${toTeamId}に移動しました`);
  }
}