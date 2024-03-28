import { ApiProperty } from "@nestjs/swagger"
import { MembershipStatus } from "../../../domain/entity/participant"

export class UpdateParticipantRequest {
  @ApiProperty()
  readonly name: string | undefined

  @ApiProperty()
  readonly email: string | undefined

  @ApiProperty()
  readonly status: MembershipStatus | undefined
}