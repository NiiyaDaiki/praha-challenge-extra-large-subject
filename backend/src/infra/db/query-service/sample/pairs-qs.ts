import { PrismaClient } from '@prisma/client'

import { IPairsQS, PairDTO } from '../../../../app/sample/query-service-interface/pairs-qs'
import { ParticipantDTO } from '../../../../app/sample/query-service-interface/participants-qs'

export class PairsQS implements IPairsQS {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async getAll(): Promise<PairDTO[]> {
    const allPairs = await this.prismaClient.pair.findMany({
      include: {
        participants: true
      }
    })

    return allPairs.map((pair) => {
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
  }
}
