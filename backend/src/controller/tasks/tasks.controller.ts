import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { GetTasksUseCase } from '../../app/get-tasks-usecase';
import { GetTasksResponse } from '../../controller/tasks/response/get-tasks-response';
import { TaskQS } from '../../infra/db/query-service/tasks-qs';

@Controller({
  path: '/tasks'
})
export class TasksController {

  @Get()
  @ApiResponse({ status: 200, type: GetTasksResponse })
  async getTasks(): Promise<GetTasksResponse> {
    const prisma = new PrismaClient()
    const qs = new TaskQS(prisma)
    const usecase = new GetTasksUseCase(qs)
    const result = await usecase.do()
    const response = new GetTasksResponse({ tasks: result })
    return response
  }

}

