import { Participant } from './participant'

export class Pair {
  readonly id: string
  readonly name: string
  readonly participants: Participant[]

  constructor(args: { id: string; name: string; participants: Participant[] }) {
    const { id, name, participants } = args
    this.isValidName(name)
    this.isValidNumberOfParticipants(participants)
    this.areParticipantsAllActive(participants)

    this.id = id
    this.name = name
    this.participants = participants
  }

  private isValidName(name: string) {
    const regex = /[^[a-zA-Z]$]/
    if (!regex.test(name)) {
      throw new Error('ペア名はa-eの英文字1文字でなければなりません。')
    }
  }

  private isValidNumberOfParticipants(participants: Participant[]) {
    if (participants.length < 2 && participants.length > 3) {
      throw new Error('ペアには2名〜3名の参加者が必要です。')
    }
  }

  private areParticipantsAllActive(participants: Participant[]) {
    if (!participants.every((participants) => participants.isActive())) {
      throw new Error(
        'すべての参加者がペアに参加できる状態でなければなりません。',
      )
    }
  }
}
