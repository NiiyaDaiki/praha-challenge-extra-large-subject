

export class Pair {
  readonly id: string
  readonly name: string
  private _participantIds: string[]

  constructor(args: { id: string; name: string; participantIds: string[] }) {
    const { id, name, participantIds } = args
    this.isValidName(name)
    this.id = id
    this.name = name
    this._participantIds = participantIds
    this.isValidNumberOfParticipants()

  }

  private isValidName(name: string) {
    const regex = /^[a-zA-Z]$/
    if (!regex.test(name)) {
      throw new Error('ペア名はa-zの英文字1文字でなければなりません。')
    }
  }

  private isValidNumberOfParticipants() {
    console.log(`現在のペア${this.name}の人数: ${this.getParticipantIds().length}`)
    if (this.getParticipantIds().length < 2 || this.getParticipantIds().length > 3) {
      throw new Error('ペアには2名〜3名の参加者が必要です。')
    }
  }

  getParticipantIds(): string[] {
    return this._participantIds
  }

  public addParticipant(memberId: string): void {
    if (this.getParticipantIds().includes(memberId)) {
      throw new Error('既にPairに所属しています。');
    }
    this.getParticipantIds().push(memberId);
    try {
      this.isValidNumberOfParticipants();
    } catch (e) {
      console.log('ペアの許容人数を超えました')
      throw e
    }
  }

  public removeParticipant(memberId: string): void {
    this._participantIds = this.getParticipantIds().filter(id => id !== memberId);
    if (this.getParticipantIds().length === 0) {
      throw new Error('Pairのメンバーが0名になりました。');
    }
  }

  public isParticipantExist = (participantId: string): boolean => {
    return this.getParticipantIds().includes(participantId)
  }
}
