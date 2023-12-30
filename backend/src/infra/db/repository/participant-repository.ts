import { PrismaClient } from '@prisma/client'
import { IParticipantRepository } from 'src/app/sample/repository-interface/participant-repository-interface'
import { Participant } from 'src/domain/entity/participant'

export class ParticipantRepository implements IParticipantRepository {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async save(participantEntity: Participant): Promise<Participant> {
    const { id, name, email, status } = participantEntity.getAllProperties()

    const savedParticipantDataModel = await this.prismaClient.participant.create({
      data: {
        id,
        name,
        email,
        status
      },
    })
    const savedSomeDataEntity = Participant.create({
      ...savedParticipantDataModel,
    })
    return savedSomeDataEntity
  }
}
