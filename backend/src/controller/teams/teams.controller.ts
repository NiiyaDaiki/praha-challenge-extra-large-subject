import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { GetTeamsUseCase } from '../../app/sample/get-teams-usecase';
import { GetTeamsResponse } from './response/get-teams-response';
import { ReassignPairParticipantRequest } from './request/update-team-request';
import { TeamsQS } from '../../infra/db/query-service/sample/teams-qs';
import { TeamRepository } from '../../infra/db/repository/team-repository';
import { ReassignPairParticipantsUseCase } from '../../app/sample/reassign-pair-participants-usecase';
import { Pair } from '../../domain/entity/pair';

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

  @Patch(':id')
  async updateTeam(
    @Param('id') id: string,
    @Body() updateTeamDto: ReassignPairParticipantRequest): Promise<void> {
    console.log(updateTeamDto)
    const prisma = new PrismaClient()
    const teamRepo = new TeamRepository(prisma)
    const usecase = new ReassignPairParticipantsUseCase(teamRepo)
    await usecase.do({
      id,
      pairs: updateTeamDto.pairs.map(pair => new Pair({
        id: pair.id,
        name: pair.name,
        participantIds: pair.participantIds
      }))
    })
  }
}

