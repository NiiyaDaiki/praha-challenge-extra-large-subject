import { PairDTO } from "./pairs-qs";

export class TeamDTO {
  public readonly id: string
  public readonly name: string
  public readonly pairs: PairDTO[]

  public constructor(props: {
    id: string;
    name: string;
    pairs: PairDTO[]
  }) {
    const { id, name, pairs } = props
    this.id = id
    this.name = name
    this.pairs = pairs
  }
}

export interface ITeamsQS {
  getAll(): Promise<TeamDTO[]>
}
