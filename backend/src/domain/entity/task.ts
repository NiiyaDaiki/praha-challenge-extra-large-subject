type Genre =
  | 'Basis'
  | 'Test'
  | 'Database'
  | 'Architecture'
  | 'Frontend'
  | 'TeamDev'
  | 'MVP'

export class Task {
  id: string
  title: string
  genre: Genre
  description: string
  public constructor(args: {
    id: string
    title: string
    genre: Genre
    description: string
  }) {
    const { id, title, genre, description } = args
    this.id = id
    this.title = title
    this.genre = genre
    this.description = description
  }
}
