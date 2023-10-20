type Status = '未着手' | 'レビュー待ち' | '完了'

export class Task {
  readonly id: string
  readonly participantId: string
  readonly taskId: string
  status: Status

  public constructor(args: {
    id: string
    participantId: string
    taskId: string
    status: Status
  }) {
    const { id, participantId, taskId, status } = args
    this.id = id
    this.participantId = participantId
    this.taskId = taskId
    this.status = status
  }

  public setStatus(status: Status) {
    if (this.status === '完了') {
      throw new Error('ステータスが完了のタスクはステータスを変更できません')
    }
    this.status = status
  }

  public isMatchedUserId(userId: string) {
    return userId === this.participantId
  }
}
