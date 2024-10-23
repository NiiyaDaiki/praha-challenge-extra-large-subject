import { ApiProperty } from '@nestjs/swagger'
import { TeamDTO } from '../../../app/sample/query-service-interface/teams-qs'

export class GetTeamsResponse {
  @ApiProperty({ type: () => [Pair] })
  teams: Pair[]

  public constructor(params: { teams: TeamDTO[] }) {
    const { teams } = params
    this.teams = teams.map(({ id, name }) => {
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
