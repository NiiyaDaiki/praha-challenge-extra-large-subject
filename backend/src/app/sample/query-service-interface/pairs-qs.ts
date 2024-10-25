import { ParticipantDTO } from "./participants-qs";

export class PairDTO {
  public readonly id: string
  public readonly name: string
  public readonly participants: ParticipantDTO[]

  public constructor(props: {
    id: string;
    name: string;
    participants: ParticipantDTO[]
  }) {
    const { id, name, participants } = props
    this.id = id
    this.name = name
    this.participants = participants
  }
}

export interface IPairsQS {
  getAll(): Promise<PairDTO[]>
}
