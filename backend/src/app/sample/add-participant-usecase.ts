import { Participant } from '../../domain/entity/participant';
import { IParticipantRepository } from './repository-interface/participant-repository-interface'
import { createRandomIdString } from '../../util/random';
import { ITaskRepository } from './repository-interface/task-repository-interface';
import { ITeamRepository } from './repository-interface/team-repository-interface';
import { UniqueEmailSpecification } from '../../domain/specifications/unique-email-specification';
import { TeamService } from '../../domain/service/team-service';

export class AddParticipantUseCase {
  public constructor(
    private readonly participantRepo: IParticipantRepository,
    private readonly taskRepo: ITaskRepository,
    private readonly teamRepo: ITeamRepository
  ) {
    this.participantRepo = participantRepo
    this.taskRepo = taskRepo
    this.teamRepo = teamRepo
  }
  public async do(params: { name: string; email: string }) {
    const { name, email } = params

    // メールアドレスの重複チェック
    const spec = new UniqueEmailSpecification(this.participantRepo)
    if (!await spec.isSatisfiedBy(params.email)) {
      throw new Error("このメールアドレスは既に登録されています");
    }

    // 参加者に紐づくタスクを作成するために、タスクを取得する
    const tasks = await this.taskRepo.findAll()

    // 参加者を作成する
    const participant = Participant.create({
      id: createRandomIdString(),
      name,
      email,
      tasks
    })


    // 最も参加人数が少ないチームを取得する(今回はチームが存在しない場合は考慮する必要はない)
    const service = new TeamService(this.teamRepo)
    const minTeams = await service.findTeamWithLeastParticipants()

    // 最小参加人数のチームからランダムに選択する
    const targetTeam = minTeams[Math.floor(Math.random() * minTeams.length)]
    if (!targetTeam) {
      throw new Error('チームが見つかりませんでした')
    }

    // 参加者をチームに追加する
    targetTeam.addParticipant(participant.id)

    // 参加者を保存する
    try {
      await this.participantRepo.save(participant)
      await this.teamRepo.save(targetTeam)
      console.log(`参加者${participant.name}をチーム${targetTeam.name}に追加しました`)
    } catch (e) {
      console.log(e)
      throw new Error('参加者の追加に失敗しました')
    }
  }
}
