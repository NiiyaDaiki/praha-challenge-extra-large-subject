import { Email } from 'src/domain/entity/participant/email'
import { MembershipStatus } from 'src/domain/entity/participant/membershipStatus'

export class Participant {
  name: string
  email: Email
  status: MembershipStatus

  constructor(name: string, email: string, status: MembershipStatus) {
    this.name = name
    this.email = new Email(email)
    this.status = status
  }
}
