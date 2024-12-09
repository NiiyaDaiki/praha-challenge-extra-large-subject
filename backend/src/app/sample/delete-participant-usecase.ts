import { IParticipantRepository } from "./repository-interface/participant-repository-interface"
import { ITeamRepository } from "./repository-interface/team-repository-interface"

export class DeleteParticipantUseCase {
  private readonly participantRepo: IParticipantRepository
  private readonly teamRepo: ITeamRepository
  public constructor(
    participantRepo: IParticipantRepository,
    teamRepo: ITeamRepository
  ) {
    this.participantRepo = participantRepo,
      this.teamRepo = teamRepo
  }
  public async do(params: { id: string }) {
    const { id } = params
    const participant = await this.participantRepo.findById(id)
    if (!participant) {
      throw new Error('参加者が見つかりませんでした')
    }
    // team取得
    const team = await this.teamRepo.findByParticipantId(participant.id)
    if (!team) {
      throw new Error('チームが見つかりませんでした')
    }
    team.removeParticipant(participant.id)

    await this.teamRepo.save(team)

    // メンバー数が2名以下の場合のメール送信処理
    if (team.getTotalParticipantCount() <= 2) {
      // メール送信処理
      console.log(`メール送信処理 チーム名:${team.getAllProperties().name}のメンバー数が2名以下になりました`)
    }

    if (!await this.participantRepo.delete(id)) {
      throw new Error('参加者が見つかりませんでした')
    }
  }
}