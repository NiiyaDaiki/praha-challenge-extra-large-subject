import { ApiProperty } from '@nestjs/swagger'
import { PairDTO } from '../../../app/query-service-interface/pairs-qs'
import { ParticipantDTO } from '../../../app/query-service-interface/participants-qs'

export class GetPairsResponse {
  @ApiProperty({ type: () => [Pair] })
  pairs: Pair[]

  public constructor(params: { pairs: PairDTO[] }) {
    const { pairs } = params
    this.pairs = pairs.map(({ id, name, participants }) => {
      return new Pair({
        id,
        name,
        participants
      })
    })
  }
}

class Pair {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  participants: ParticipantDTO[]

  public constructor(params: {
    id: string
    name: string
    participants: ParticipantDTO[]
  }) {
    this.id = params.id
    this.name = params.name
    this.participants = params.participants
  }
}
