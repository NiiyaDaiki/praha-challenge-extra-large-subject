import { PrismaClient } from '@prisma/client'

import { ITeamsQS, TeamDTO } from '../../../../app/sample/query-service-interface/teams-qs'

export class TeamsQS implements ITeamsQS {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async getAll(): Promise<TeamDTO[]> {
    const allTeams = await this.prismaClient.team.findMany()
    return allTeams.map(
      (team) =>
        new TeamDTO({
          id: team.id,
          name: team.name,
        }),
    )
  }
}
