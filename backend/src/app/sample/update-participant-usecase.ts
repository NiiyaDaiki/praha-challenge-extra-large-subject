import { MembershipStatus, Participant } from '../../domain/entity/participant';
import { IParticipantRepository } from './repository-interface/participant-repository-interface'

export class UpdateParticipantUseCase {
  public constructor(
    private readonly participantRepo: IParticipantRepository,
  ) {
  }
  public async do(params: { id: string, name?: string; email?: string; status?: MembershipStatus }) {
    const targetParticipant = await this.participantRepo.findById(params.id)

    if (!targetParticipant) {
      throw new Error('参加者が見つかりませんでした')
    }

    const participant = Participant.reconstruct({
      id: params.id,
      name: params.name ?? targetParticipant.name,
      email: params.email ?? targetParticipant.email,
      status: params.status ?? targetParticipant.status,
      tasks: targetParticipant.participantTasks,
    })

    await this.participantRepo.save(participant)
  }
}
