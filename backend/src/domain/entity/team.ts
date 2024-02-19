import { Pair } from '../../domain/entity/pair'

export class Team {
  readonly id: string
  readonly name: string
  readonly pairs: Pair[]

  constructor(id: string, name: string, pairs: Pair[]) {
    this.isValidName(name)

    this.id = id
    this.name = name
    this.pairs = pairs
  }

  private isValidName(name: string): void {
    if (name.length > 3) {
      throw new Error('チーム名は3文字以下にしてください')
    }

    const numValue = Number(name)

    if (isNaN(numValue)) {
      throw new Error('チーム名は数字にしてください')
    }

    if (numValue < 0 || !Number.isInteger(numValue)) {
      throw new Error('チーム名の数字は正の整数にしてください')
    }
  }
}
