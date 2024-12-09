import { Team } from '../entity/team';
import { ITeamRepository } from '../../app/sample/repository-interface/team-repository-interface';

export class TeamService {
  constructor(private readonly teamRepo: ITeamRepository) {
    this.teamRepo = teamRepo;
  }

  public async findTeamWithLeastParticipants(): Promise<Team[]> {
    console.log('最小の参加者数を持つチームを取得します');
    const teams = await this.teamRepo.findAll();

    if (teams.length === 0) {
      throw new Error('チームが存在しません');
    }

    // 最小の参加者数を計算
    const minParticipantCount = Math.min(
      ...teams.map(team => team.getTotalParticipantCount())
    );

    // 最小の参加者数を持つチームをフィルタリング
    const minTeams = teams.filter(
      team => team.getTotalParticipantCount() === minParticipantCount
    );

    if (minTeams.length === 0) {
      throw new Error('最小の参加者数を持つチームが見つかりませんでした');
    }
    console.log(`最小の参加者数を持つチーム: ${minTeams.map(team => team.name)}`);
    return minTeams;
  }
}