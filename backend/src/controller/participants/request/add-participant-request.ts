import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class AddParticipantRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly name!: string

  @ApiProperty()
  @IsNotEmpty()
  readonly email!: string
}