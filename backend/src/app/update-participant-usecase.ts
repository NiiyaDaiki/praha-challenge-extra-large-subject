import { MembershipStatus, Participant } from '../domain/entity/participant';
import { TeamService } from '../domain/service/team-service';
import { UniqueEmailSpecification } from '../domain/specifications/unique-email-specification';
import { IParticipantRepository } from './repository-interface/participant-repository-interface'
import { ITeamRepository } from './repository-interface/team-repository-interface';

export class UpdateParticipantUseCase {
  public constructor(
    private readonly participantRepo: IParticipantRepository,
    private readonly teamRepo: ITeamRepository,
  ) {
  }
  public async do(params: { id: string, name?: string; email?: string; status?: MembershipStatus }) {
    console.log('参加者情報を更新します')
    // statusの値が不正な場合はエラーを返す
    if (params.status !== 'ACTIVE' && params.status !== 'INACTIVE' && params.status !== 'LEFT') {
      throw new Error('statusの値が不正です')
    }

    const targetParticipant = await this.participantRepo.findById(params.id)

    if (!targetParticipant) {
      throw new Error('参加者が見つかりませんでした')
    }
    // メールアドレスの重複チェック
    if (params.email) {
      const spec = new UniqueEmailSpecification(this.participantRepo)
      if (!await spec.isSatisfiedBy(params.email)) {
        throw new Error("このメールアドレスは既に登録されています");
      }
    }

    // statusの更新
    if (params.status === 'ACTIVE') {
      // 復帰する(ACTIVEに変更)場合
      // 少ない人数のチームに追加する
      // todo サービスとかもDIする？少ない人数のチームを取得する処理は、リポジトリに書いてもいい？
      const service = new TeamService(this.teamRepo)
      const minTeams = await service.findTeamWithLeastParticipants()

      // 最小参加人数のチームからランダムに選択する
      const targetTeam = minTeams[Math.floor(Math.random() * minTeams.length)]
      if (!targetTeam) {
        throw new Error('チームが見つかりませんでした')
      }

      // 参加者をチームに追加する
      targetTeam.addParticipant(params.id)
      await this.teamRepo.save(targetTeam)
    } else {
      // 休会・退会する(INACTIVE・LEFTに変更)場合
      // 所属チームを取得する
      const targetTeam = await this.teamRepo.findByParticipantId(params.id)
      if (!targetTeam) {
        throw new Error('チームが見つかりませんでした')
      }
      targetTeam.removeParticipant(params.id)
      await this.teamRepo.save(targetTeam)
    }

    const participant = Participant.reconstruct({
      id: params.id,
      name: params.name ?? targetParticipant.name,
      email: params.email ?? targetParticipant.email,
      status: params.status ?? targetParticipant.status,
      tasks: targetParticipant.participantTasks,
    })

    await this.participantRepo.save(participant)
    console.log('参加者情報を更新しました')
  }
}
