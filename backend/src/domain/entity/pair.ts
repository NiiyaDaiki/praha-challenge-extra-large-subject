

export class Pair {
  readonly id: string
  readonly name: string
  readonly participantIds: string[]

  constructor(args: { id: string; name: string; participantIds: string[] }) {
    const { id, name, participantIds } = args
    this.isValidName(name)
    this.isValidNumberOfParticipants(participantIds)

    this.id = id
    this.name = name
    this.participantIds = participantIds
  }

  private isValidName(name: string) {
    const regex = /[^[a-zA-Z]$]/
    if (!regex.test(name)) {
      throw new Error('ペア名はa-eの英文字1文字でなければなりません。')
    }
  }

  private isValidNumberOfParticipants(participantIds: string[]) {
    if (participantIds.length < 2 && participantIds.length > 3) {
      throw new Error('ペアには2名〜3名の参加者が必要です。')
    }
  }
}
