import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { AddParticipantUseCase } from '../../app/sample/add-participant-usecase';
import { GetParticipantsUseCase } from '../../app/sample/get-participants-usecase';
import { AddParticipantRequest } from '../../controller/participants/request/add-participant-request';
import { GetParticipantsResponse } from '../../controller/participants/response/get-participants-response';
import { ParticipantsQS } from '../../infra/db/query-service/sample/participants-qs';
import { ParticipantRepository } from '../../infra/db/repository/participant-repository';
import { UpdateParticipantRequest } from './request/update-participant-request';
import { UpdateParticipantUseCase } from '../../app/sample/update-participant-usecase';
import { DeleteParticipantUseCase } from '../../app/sample/delete-participant-usecase';
import { TeamRepository } from '../../infra/db/repository/team-repository';
import { TaskRepository } from '../../infra/db/repository/task-repository';

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
    const participantRepo = new ParticipantRepository(prisma)
    const taskRepo = new TaskRepository(prisma)
    const teamRepo = new TeamRepository(prisma)
    const usecase = new AddParticipantUseCase(participantRepo, taskRepo, teamRepo)
    await usecase.do(postUserDto)
  }

  @Post(':id')
  async updateParticipant(
    @Param('id') id: string,
    @Body() updateParticipantDto: UpdateParticipantRequest): Promise<void> {
    const prisma = new PrismaClient()
    const participantRepo = new ParticipantRepository(prisma)
    const usecase = new UpdateParticipantUseCase(participantRepo)
    await usecase.do({
      id,
      name: updateParticipantDto.name,
      email: updateParticipantDto.email,
      status: updateParticipantDto.status,

    })
  }

  @Delete(':id')
  async deleteParticipant(@Param('id') id: string,): Promise<void> {
    const prisma = new PrismaClient()
    const participantRepo = new ParticipantRepository(prisma)
    const teamRepo = new TeamRepository(prisma)
    const usecase = new DeleteParticipantUseCase(participantRepo, teamRepo)
    await usecase.do({
      id
    })
  }
}

