import { Genre } from "../../../domain/entity/task/task";

export class TaskDTO {
  public readonly id: string
  public readonly genre: Genre
  public readonly title: string
  public readonly description: string

  public constructor(props: {
    id: string;
    genre: Genre;
    title: string;
    description: string
  }) {
    const { id, genre, title, description } = props
    this.id = id
    this.genre = genre
    this.title = title
    this.description = description
  }
}

export interface ITaskQS {
  getAll(): Promise<TaskDTO[]>
}
