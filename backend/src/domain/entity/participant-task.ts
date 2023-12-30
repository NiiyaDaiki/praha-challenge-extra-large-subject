import { Progress } from "../../domain/entity/task/progress"

export class ParticipantTask {
  readonly id: string
  readonly participantId: string
  readonly taskId: string
  progress: Progress

  private constructor(args: {
    id: string
    participantId: string
    taskId: string
    progress: Progress
  }) {
    const { id, participantId, taskId, progress = 'NOT_STARTED' } = args
    this.id = id
    this.participantId = participantId
    this.taskId = taskId
    this.progress = progress
  }

  static create(args: {
    id: string
    participantId: string
    taskId: string
  }) {
    return new ParticipantTask({ ...args, progress: 'NOT_STARTED' })
  }

  static reconstruct(args: {
    id: string;
    participantId: string;
    taskId: string;
    progress: Progress
  }) {
    return new ParticipantTask(args)
  }

  public getAllProperties() {
    return {
      id: this.id,
      participantId: this.participantId,
      taskId: this.taskId,
      progress: this.progress,
    }
  }

  public setProgress(progress: Progress) {
    if (this.progress === 'COMPLETED') {
      throw new Error('ステータスが完了のタスクはステータスを変更できません')
    }
    this.progress = progress
  }

  public isMatchedParticipantId(participantId: string) {
    return participantId === this.participantId
  }
}
