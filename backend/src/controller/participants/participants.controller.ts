import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { AddParticipantUseCase } from '../../app/add-participant-usecase';
import { GetParticipantsUseCase } from '../../app/get-participants-usecase';
import { AddParticipantRequest } from '../../controller/participants/request/add-participant-request';
import { GetParticipantsResponse } from '../../controller/participants/response/get-participants-response';
import { ParticipantsQS } from '../../infra/db/query-service/participants-qs';
import { ParticipantRepository } from '../../infra/db/repository/participant-repository';
import { UpdateParticipantRequest } from './request/update-participant-request';
import { UpdateParticipantUseCase } from '../../app/update-participant-usecase';
import { DeleteParticipantUseCase } from '../../app/delete-participant-usecase';
import { TeamRepository } from '../../infra/db/repository/team-repository';
import { TaskRepository } from '../../infra/db/repository/task-repository';
import { SearchParticipantsResponse } from './response/search-participants-response';
import { SearchParticipantsUseCase } from '../../app/search-participants-usecase';
import { ParticipantTasksQS } from '../../infra/db/query-service/participant-task-qs';

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

  @Get('search')
  @ApiResponse({ status: 200, type: SearchParticipantsResponse })
  // 特定の課題（複数可能）が特定の進捗ステータスになっている参加者を10人単位でページングして取得する
  async searchParticipants(
    // taskIdが一つだった場合も配列で受け取るようにする
    @Query('taskIds', new ParseArrayPipe({ items: String })) taskIds: string[],
    @Query('progress') progress: string,
    @Query('cursor') cursor?: string,
  ): Promise<SearchParticipantsResponse> {
    const prisma = new PrismaClient()
    const qs = new ParticipantTasksQS(prisma)
    const usecase = new SearchParticipantsUseCase(qs)
    const result = await usecase.do({
      taskIds,
      progress,
      cursor
    })
    const response = new SearchParticipantsResponse({ participantTasks: result })
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
    console.log(updateParticipantDto)
    const prisma = new PrismaClient()
    const participantRepo = new ParticipantRepository(prisma)
    const teamRepo = new TeamRepository(prisma)
    const usecase = new UpdateParticipantUseCase(participantRepo, teamRepo)
    await usecase.do({
      id,
      name: updateParticipantDto.name,
      email: updateParticipantDto.email,
      status: updateParticipantDto.status
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

