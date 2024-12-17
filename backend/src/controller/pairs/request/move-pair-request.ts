import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class MovePairRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly teamId!: string
}
