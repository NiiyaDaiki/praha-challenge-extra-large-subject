import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { GetTeamsUseCase } from '../../app/sample/get-teams-usecase';
import { GetTeamsResponse } from './response/get-teams-response';
import { TeamsQS } from '../../infra/db/query-service/sample/teams-qs';

@Controller({
  path: '/teams'
})
export class TeamsController {

  @Get()
  @ApiResponse({ status: 200, type: GetTeamsResponse })
  async getTeams(): Promise<GetTeamsResponse> {
    const prisma = new PrismaClient()
    const qs = new TeamsQS(prisma)
    const usecase = new GetTeamsUseCase(qs)
    const result = await usecase.do()
    const response = new GetTeamsResponse({ teams: result })
    return response
  }
}

