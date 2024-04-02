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
    if (await this.participantRepo.delete(id)) {
      throw new Error('参加者が見つかりませんでした')
    }
  }
}