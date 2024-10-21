import { ApiProperty } from '@nestjs/swagger'
import { PairDTO } from '../../../app/sample/query-service-interface/pairs-qs'

export class GetPairsResponse {
  @ApiProperty({ type: () => [Pair] })
  pairs: Pair[]

  public constructor(params: { pairs: PairDTO[] }) {
    const { pairs } = params
    this.pairs = pairs.map(({ id, name }) => {
      return new Pair({
        id,
        name
      })
    })
  }
}

class Pair {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  public constructor(params: {
    id: string
    name: string
  }) {
    this.id = params.id
    this.name = params.name
  }
}
