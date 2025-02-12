import { ApiProperty } from '@nestjs/swagger'
import { Genre } from '../../../domain/entity/task/task'
import { TaskDTO } from '../../../app/query-service-interface/tasks-qs'

export class GetTasksResponse {
  @ApiProperty({ type: () => [Task] })
  tasks: Task[]

  public constructor(params: { tasks: TaskDTO[] }) {
    const { tasks } = params
    this.tasks = tasks.map(({ id, title, genre, description }) => {
      return new Task({
        id,
        title,
        genre,
        description
      })
    })
  }
}

class Task {
  @ApiProperty()
  id: string

  @ApiProperty()
  title: string

  @ApiProperty()
  genre: Genre

  @ApiProperty()
  description: string

  public constructor(params: {
    id: string
    title: string
    genre: Genre
    description: string
  }) {
    this.id = params.id
    this.title = params.title
    this.genre = params.genre
    this.description = params.description
  }
}
