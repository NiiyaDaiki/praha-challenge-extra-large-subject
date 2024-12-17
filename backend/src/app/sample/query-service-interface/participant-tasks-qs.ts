import { MembershipStatus } from "../../../domain/entity/participant";
import { Progress } from "../../../domain/entity/task/progress";

export class SearchParticipantTasksDTO {
  public readonly id: string
  public readonly progress: Progress
  public readonly task: {
    id: string
    genre: string
    title: string
  }
  public readonly participant: {
    id: string
    name: string
    status: MembershipStatus
  }

  public constructor(props: {
    id: string
    progress: Progress
    task: {
      id: string
      genre: string
      title: string
    }
    participant: {
      id: string
      name: string
      status: MembershipStatus
    }
  }) {
    const { id, task, participant, progress } = props
    this.id = id
    this.task = task
    this.participant = participant
    this.progress = progress
  }
}

export interface IParticipantTasksQS {
  search10ParticipantsByTaskProgress(params: { taskIds: string[], progress: string, cursor?: string }): Promise<SearchParticipantTasksDTO[]>
}
