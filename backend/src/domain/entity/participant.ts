import { ParticipantTask } from "../../domain/entity/participant-task"
import { Task } from "../../domain/entity/task/task"
import { createRandomIdString } from "../../util/random"

export type MembershipStatus = 'ACTIVE' | 'INACTIVE' | 'LEFT'
export class Participant {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly status: MembershipStatus
  readonly pairId: string
  readonly participantTasks: ParticipantTask[]

  private constructor(props: {
    id: string,
    name: string,
    email: string,
    status?: MembershipStatus,
    pairId: string,
    tasks: ParticipantTask[];
  }) {
    const { id, name, email, status = 'ACTIVE', pairId, tasks } = props
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email address provided.')
    }
    this.id = id
    this.name = name
    this.email = email
    this.status = status
    this.pairId = pairId
    this.participantTasks = tasks
  }

  static create(props: { id: string; name: string; email: string; tasks: Task[], pairId: string }) {
    const participantTasks = props.tasks.map(task => ParticipantTask.create({
      id: createRandomIdString(),
      participantId: props.id,
      taskId: task.id,
    }));
    return new Participant({ ...props, tasks: participantTasks, status: 'ACTIVE' });
  }

  static reconstruct(props: { id: string; name: string; email: string; status: MembershipStatus; tasks: ParticipantTask[], pairId: string }): Participant {
    return new Participant({ ...props });
  }

  private isValidEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(email)
  }

  // public addParticipantTasks(id: string, tasks: Task[]) {
  //   // TODO: 重複しているタスクを除外する

  //   return tasks.map(task => ParticipantTask.create({
  //     id: createRandomIdString(),
  //     participantId: id,
  //     taskId: task.id,
  //   }));
  // }

  public isActive() {
    return this.status === 'ACTIVE'
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      status: this.status,
      pairId: this.pairId,
      tasks: this.participantTasks
    }
  }
}
