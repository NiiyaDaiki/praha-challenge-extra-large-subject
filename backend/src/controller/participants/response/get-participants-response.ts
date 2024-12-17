import { ApiProperty } from '@nestjs/swagger'
import { ParticipantDTO } from '../../../app/query-service-interface/participants-qs'
import { MembershipStatus } from '../../../domain/entity/participant'

export class GetParticipantsResponse {
  @ApiProperty({ type: () => [Participant] })
  participants: Participant[]

  public constructor(params: { participants: ParticipantDTO[] }) {
    const { participants } = params
    this.participants = participants.map(({ id, name, email, status }) => {
      return new Participant({
        id,
        name,
        email,
        status
      })
    })
  }
}

class Participant {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  email: string

  @ApiProperty()
  status: MembershipStatus

  public constructor(params: {
    id: string
    name: string
    email: string
    status: MembershipStatus
  }) {
    this.id = params.id
    this.name = params.name
    this.email = params.email
    this.status = params.status
  }
}
