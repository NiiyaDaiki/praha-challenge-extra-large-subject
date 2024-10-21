import { PrismaClient } from '@prisma/client'
import { IPairRepository } from '../../../app/sample/repository-interface/pair-repository-interface'
import { Pair } from '../../../domain/entity/pair'

export class PairRepository implements IPairRepository {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findById(id: string): Promise<Pair | undefined> {
    const pairDataModel = await this.prismaClient.pair.findUnique({
      where: { id }
    })

    if (!pairDataModel) {
      return undefined
    }
  }

}