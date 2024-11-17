import { PrismaClient } from '@prisma/client'

import { ITeamsQS, TeamDTO } from '../../../../app/sample/query-service-interface/teams-qs'
import { ParticipantDTO } from '../../../../app/sample/query-service-interface/participants-qs'
import { PairDTO } from '../../../../app/sample/query-service-interface/pairs-qs'

export class TeamsQS implements ITeamsQS {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async getAll(): Promise<TeamDTO[]> {
    const allTeams = await this.prismaClient.team.findMany({
      include: {
        pairs: {
          include: {
            participants: true
          }
        }
      }
    })

    return allTeams.map((team) => {
      const pairs = team.pairs.map((pair) => {
        const participants = pair.participants.map((participant) => {
          return new ParticipantDTO({
            ...participant
          })
        })
        return new PairDTO({
          id: pair.id,
          name: pair.name,
          participants: participants
        })
      })
      return new TeamDTO({
        id: team.id,
        name: team.name,
        pairs: pairs
      })
    })
  }
}
