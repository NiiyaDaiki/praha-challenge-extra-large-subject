import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { GetPairsUseCase } from '../../app/sample/get-pairs-usecase';
import { GetPairsResponse } from './response/get-pairs-response';
import { PairsQS } from '../../infra/db/query-service/sample/pairs-qs';

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
}

