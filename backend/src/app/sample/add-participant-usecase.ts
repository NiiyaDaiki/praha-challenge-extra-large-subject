import { Participant } from 'src/domain/entity/participant';
import { IParticipantRepository } from './repository-interface/participant-repository-interface'
import { createRandomIdString } from 'src/util/random';
import { ITaskQS } from 'src/app/sample/query-service-interface/tasks-qs';
import { ParticipantTask } from 'src/domain/entity/participant-task';
import { IParticipantTaskRepository } from 'src/app/sample/repository-interface/participant-task-repository-interface';

export class AddParticipantUseCase {
  private readonly participantRepo: IParticipantRepository
  private readonly taskQS: ITaskQS
  private readonly participantTaskRepo: IParticipantTaskRepository

  public constructor(participantRepo: IParticipantRepository, taskQS: ITaskQS, participantTaskRepo: IParticipantTaskRepository) {
    this.participantRepo = participantRepo
    this.taskQS = taskQS
    this.participantTaskRepo = participantTaskRepo
  }
  public async do(params: { name: string; email: string }) {
    const { name, email } = params

    const participant = Participant.create({
      id: createRandomIdString(),
      name,
      email
    })

    // 参加者を保存する。(タスクを作成するのと同一トランザクションで行う方が良い？)
    await this.participantRepo.save(participant)

    // 参加者に紐づくタスクを作成する
    const tasks = await this.taskQS.getAll()
    const participantTasks = tasks.map(task => ParticipantTask.create({
      id: createRandomIdString(),
      participantId: participant.id,
      taskId: task.id,
    }));
    // mapは非同期処理を特に待たないため、各save操作の完了を保証しない可能性がある。
    // データ整合性の問題を引き起こす可能性があるので、for文で順序を守りつつ保存する。
    // (promise.allを使う方法もあるが、順番が保証されないため、今回は使わない。)
    for (const participantTask of participantTasks) {
      await this.participantTaskRepo.save(participantTask);
    }
  }
}
