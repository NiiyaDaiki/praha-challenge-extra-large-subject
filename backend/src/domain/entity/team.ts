export class Team {
  id: string
  name: string

  constructor(id: string, name: string) {
    this.isValidName(name)

    this.id = id
    this.name = name
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
      throw new Error('数字は正の整数にしてください')
    }
  }
}
