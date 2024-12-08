import { ApiProperty } from "@nestjs/swagger"
import { Progress } from "../../../domain/entity/task/progress"

export class UpdateParticipantTaskRequest {
  @ApiProperty()
  readonly progress!: Progress
}