type MembershipStatus = 'Active' | 'Inactive' | 'Left'
export class Participant {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly status: MembershipStatus

  constructor(
    id: string,
    name: string,
    email: string,
    status: MembershipStatus,
  ) {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email address provided.')
    }
    this.id = id
    this.name = name
    this.email = email
    this.status = status
  }

  private isValidEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(email)
  }

  public isActive() {
    return this.status === 'Active'
  }
}
