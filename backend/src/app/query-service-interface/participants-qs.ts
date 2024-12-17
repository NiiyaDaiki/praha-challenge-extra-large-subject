import { MembershipStatus } from "../../domain/entity/participant";

export class ParticipantDTO {
  public readonly id: string
  public readonly name: string
  public readonly email: string
  public readonly status: MembershipStatus

  public constructor(props: {
    id: string;
    name: string;
    email: string;
    status: MembershipStatus
  }) {
    const { id, name, email, status } = props
    this.id = id
    this.name = name
    this.email = email
    this.status = status
  }
}

export interface IParticipantsQS {
  getAll(): Promise<ParticipantDTO[]>
}
