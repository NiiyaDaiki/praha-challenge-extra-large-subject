import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { AddParticipantUseCase } from 'src/app/sample/add-participant-usecase';
import { GetParticipantsUseCase } from 'src/app/sample/get-participants-usecase';
import { AddParticipantRequest } from 'src/controller/participants/request/add-participant-request';
import { GetParticipantsResponse } from 'src/controller/participants/response/get-participants-response';
import { ParticipantsQS } from 'src/infra/db/query-service/sample/participants-qs';
import { ParticipantRepository } from 'src/infra/db/repository/participant-repository';

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

  @Post()
  async addParticipant(@Body() postUserDto: AddParticipantRequest): Promise<void> {
    const prisma = new PrismaClient()
    const repo = new ParticipantRepository(prisma)
    const usecase = new AddParticipantUseCase(repo)
    await usecase.do(postUserDto)
  }
}

