import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

class PairInput {
  @ApiProperty()
  readonly id!: string

  @ApiProperty()
  readonly name!: string

  @ApiProperty({ type: [String] })
  readonly participantIds!: string[]
}

export class ReassignPairParticipantRequest {
  @ApiProperty({ type: [PairInput] })
  @IsNotEmpty()
  readonly pairs!: PairInput[]
}