import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { GetParticipantsUseCase } from 'src/app/sample/get-participants-usecase';
import { GetParticipantsResponse } from 'src/controller/participants/response/get-participants-response';
import { ParticipantsQS } from 'src/infra/db/query-service/sample/participants-qs';

@Controller({
  path: '/participants'
})
export class ParticipantsController {

  @Get()
  @ApiResponse({ status: 200, type: GetParticipantsResponse })
  async getParticipants(): Promise<GetParticipantsResponse> {
    const prisma = new PrismaClient()
    const qs = new ParticipantsQS(prisma)
    const usecase = new GetParticipantsUseCase(qs)
    const result = await usecase.do()
    const response = new GetParticipantsResponse({ participants: result })
    return response
  }

}


