import { PrismaClient } from '@prisma/client'

import { IPairsQS, PairDTO } from '../../../../app/sample/query-service-interface/pairs-qs'

export class PairsQS implements IPairsQS {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async getAll(): Promise<PairDTO[]> {
    const allPairs = await this.prismaClient.pair.findMany({ include: { participants: true } })
    return allPairs.map(
      (pair) =>
        new PairDTO({
          id: pair.id,
          name: pair.name,
        }),
    )
  }
}
