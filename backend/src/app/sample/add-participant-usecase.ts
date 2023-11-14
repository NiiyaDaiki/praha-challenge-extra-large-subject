import { Participant } from 'src/domain/entity/participant';
import { IParticipantRepository } from './repository-interface/participant-repository-interface'
import { createRandomIdString } from 'src/util/random';

export class AddParticipantUseCase {
  private readonly participantRepo: IParticipantRepository
  public constructor(participantRepo: IParticipantRepository) {
    this.participantRepo = participantRepo
  }
  public async do(params: { name: string; email: string }) {
    const { name, email } = params

    const participant = Participant.create({
      id: createRandomIdString(),
      name,
      email
    })

    return await this.participantRepo.save(participant)
  }
}
