import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { GetPairsUseCase } from '../../app/sample/get-pairs-usecase';
import { GetPairsResponse } from './response/get-pairs-response';
import { PairsQS } from '../../infra/db/query-service/sample/pairs-qs';
import { MovePairUseCase } from '../../app/sample/move-pair-usecase';
import { TeamRepository } from '../../infra/db/repository/team-repository';
import { MovePairRequest } from './request/move-pair-request';

@Controller({
  path: '/pairs'
})
export class PairsController {

  @Get()
  @ApiResponse({ status: 200, type: GetPairsResponse })
  async getPairs(): Promise<GetPairsResponse> {
    const prisma = new PrismaClient()
    const qs = new PairsQS(prisma)
    const usecase = new GetPairsUseCase(qs)
    const result = await usecase.do()
    const response = new GetPairsResponse({ pairs: result })
    return response
  }

  @Patch(':id')
  @ApiResponse({ status: 200 })
  async movePair(
    @Param('id') id: string,
    @Body() movePairDto: MovePairRequest): Promise<void> {
    const prisma = new PrismaClient()
    const teamRepo = new TeamRepository(prisma)
    const usecase = new MovePairUseCase(teamRepo)
    await usecase.do({
      pairId: id,
      toTeamId: movePairDto.teamId
    })
  }
}

