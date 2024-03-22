import { PrismaClient } from '@prisma/client'

import { IParticipantsQS, ParticipantDTO } from '../../../../app/sample/query-service-interface/participants-qs'

export class ParticipantsQS implements IParticipantsQS {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async getAll(): Promise<ParticipantDTO[]> {
    const allPariticipants = await this.prismaClient.participant.findMany()
    return allPariticipants.map(
      (participant) =>
        new ParticipantDTO({
          ...participant,
        }),
    )
  }
}
