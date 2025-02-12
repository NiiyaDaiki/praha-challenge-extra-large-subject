import { Progress } from '../domain/entity/task/progress';
import { IParticipantTaskRepository } from './repository-interface/participant-task-repository-interface';

export class UpdateParticipantTaskUseCase {
  public constructor(
    private readonly participantTaskRepo: IParticipantTaskRepository,
  ) {
    this.participantTaskRepo = participantTaskRepo
  }
  public async do(params: { participantId: string, taskId: string; progress: Progress }): Promise<void> {
    console.log(`参加者:${params.participantId}の課題${params.taskId}の進捗を${params.progress}に更新します`)
    // statusの値が不正な場合はエラーを返す
    if (params.progress !== 'NOT_STARTED' && params.progress !== 'IN_REVIEW' && params.progress !== 'COMPLETED') {
      throw new Error('progressの値が不正です')
    }

    const targetParticipantTask = await this.participantTaskRepo.findOneByParticipantIdAndTaskId(params.participantId, params.taskId)
    if (!targetParticipantTask) {
      throw new Error('参加者課題が見つかりませんでした')
    }

    targetParticipantTask.setProgress(params.progress)
    await this.participantTaskRepo.save(targetParticipantTask)

    console.log(`参加者:${params.participantId}の課題${params.taskId}の進捗を${params.progress}に更新しました`)
  }
}
