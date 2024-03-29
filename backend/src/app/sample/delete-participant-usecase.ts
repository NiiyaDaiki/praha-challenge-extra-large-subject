import { IParticipantRepository } from "./repository-interface/participant-repository-interface"

export class DeleteParticipantUseCase {
  private readonly participantRepo: IParticipantRepository
  public constructor(
    participantRepo: IParticipantRepository,
  ) {
    this.participantRepo = participantRepo
  }
  public async do(params: { id: string }) {
    const { id } = params
    await this.participantRepo.delete(id)
  }
}