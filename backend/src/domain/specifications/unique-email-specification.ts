import { IParticipantRepository } from "../../app/repository-interface/participant-repository-interface.js";

export class UniqueEmailSpecification {
  private participantRepository: IParticipantRepository
  constructor(participantRepository: IParticipantRepository) {
    this.participantRepository = participantRepository
  }

  async isSatisfiedBy(email: string): Promise<boolean> {
    const sameEmailParticipant = await this.participantRepository.findByEmail(email);
    return !sameEmailParticipant;
  }
}