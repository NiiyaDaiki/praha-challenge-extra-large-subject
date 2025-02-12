import { ApiProperty } from '@nestjs/swagger'
import { MembershipStatus } from '../../../domain/entity/participant'
import { SearchParticipantTasksDTO } from '../../../app/sample/query-service-interface/participant-tasks-qs'
import { Progress } from '../../../domain/entity/task/progress'

export class SearchParticipantsResponse {
  @ApiProperty({ type: () => [ParticipantTasks] })
  participantTasks: ParticipantTasks[]

  public constructor(params: { participantTasks: SearchParticipantTasksDTO[] }) {
    const { participantTasks } = params
    this.participantTasks = participantTasks.map(participantTasks => {
      return {
        id: participantTasks.id,
        participant: new Participant(
          {
            id: participantTasks.participant.id,
            name: participantTasks.participant.name,
            status: participantTasks.participant.status,
            task: new Task(
              {
                id: participantTasks.task.id,
                genre: participantTasks.task.genre,
                title: participantTasks.task.title,
                progress: participantTasks.progress
              }
            )
          }
        )
      }
    })
  }
}

class Task {
  @ApiProperty()
  id: string

  @ApiProperty()
  genre: string

  @ApiProperty()
  title: string

  @ApiProperty()
  progress: Progress

  public constructor(params: {
    id: string
    genre: string
    title: string
    progress: Progress
  }) {
    this.id = params.id
    this.genre = params.genre
    this.title = params.title
    this.progress = params.progress
  }
}

class Participant {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  status: MembershipStatus

  @ApiProperty()
  task: Task

  public constructor(params: {
    id: string
    name: string
    status: MembershipStatus
    task: Task
  }) {
    this.id = params.id
    this.name = params.name
    this.status = params.status
    this.task = params.task
  }
}

class ParticipantTasks {
  @ApiProperty()
  id: string

  @ApiProperty()
  participant: Participant

  public constructor(params: {
    id: string
    participant: Participant
  }) {
    this.id = params.id
    this.participant = params.participant
  }
}


