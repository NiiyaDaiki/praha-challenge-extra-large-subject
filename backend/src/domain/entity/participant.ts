export type MembershipStatus = 'ACTIVE' | 'INACTIVE' | 'LEFT'
export class Participant {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly status: MembershipStatus

  private constructor(props: {
    id: string,
    name: string,
    email: string,
    status?: MembershipStatus,
  }) {
    const { id, name, email, status = 'ACTIVE' } = props
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email address provided.')
    }
    this.id = id
    this.name = name
    this.email = email
    this.status = status
  }

  static create(props: { id: string; name: string; email: string }) {
    return new Participant({ ...props, status: 'ACTIVE' });
  }

  static reconstruct(props: { id: string; name: string; email: string; status: MembershipStatus }): Participant {
    return new Participant({ ...props });
  }

  private isValidEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(email)
  }

  public isActive() {
    return this.status === 'ACTIVE'
  }
}
