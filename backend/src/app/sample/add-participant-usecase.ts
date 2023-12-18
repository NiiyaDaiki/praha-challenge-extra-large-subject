import { Participant } from 'src/domain/entity/participant';
import { IParticipantRepository } from './repository-interface/participant-repository-interface'
import { createRandomIdString } from 'src/util/random';
import { ITaskQS } from 'src/app/sample/query-service-interface/tasks-qs';

export class AddParticipantUseCase {
  public constructor(
    private readonly participantRepo: IParticipantRepository,
    private readonly taskQS: ITaskQS) {
  }
  public async do(params: { name: string; email: string }) {
    const { name, email } = params

    // 参加者に紐づくタスクを作成するために、タスクを取得する。
    const tasks = await this.taskQS.getAll()

    // 参加者を作成する。
    const participant = Participant.create({
      id: createRandomIdString(),
      name,
      email,
      tasks,
    })

    // 参加者を保存する。
    await this.participantRepo.save(participant)
  }
}
