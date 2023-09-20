type MembershipStatus = 'Active' | 'Inactive' | 'Left'
export class Participant {
  name: string
  email: string
  status: MembershipStatus

  constructor(name: string, email: string, status: MembershipStatus) {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email address provided.')
    }
    this.name = name
    this.email = email
    this.status = status
  }

  private isValidEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(email)
  }
}
