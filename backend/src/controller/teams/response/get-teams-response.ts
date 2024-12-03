import { ApiProperty } from '@nestjs/swagger'
import { TeamDTO } from '../../../app/sample/query-service-interface/teams-qs'
import { PairDTO } from '../../../app/sample/query-service-interface/pairs-qs'

export class GetTeamsResponse {
  @ApiProperty({ type: () => [Team] })
  teams: Team[]

  public constructor(params: { teams: TeamDTO[] }) {
    const { teams } = params
    this.teams = teams.map(({ id, name, pairs }) => {
      return new Team({
        id,
        name,
        pairs
      })
    })
  }
}

class Team {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty({ type: () => [PairDTO] })
  pairs: PairDTO[]

  public constructor(params: { id: string; name: string; pairs: PairDTO[] }) {
    this.id = params.id
    this.name = params.name
    this.pairs = params.pairs
  }
}
