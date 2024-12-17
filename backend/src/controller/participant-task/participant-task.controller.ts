import { Body, Controller, Param, Patch } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UpdateParticipantTaskRequest } from '../participant-task/request/update-participant-task-request';
import { UpdateParticipantTaskUseCase } from '../../app/sample/update-participant-task-usecase';
import { ParticipantTaskRepository } from '../../infra/db/repository/participant-task-repository';

@Controller({
  path: '/participant-tasks'
})
export class ParticipantTasksController {
  @Patch('/:participantId/:taskId')
  async updateParticipantTask(
    @Param('participantId') participantId: string,
    @Param('taskId') taskId: string,
    @Body() updateParticipantTaskDto: UpdateParticipantTaskRequest
  ): Promise<void> {
    const prisma = new PrismaClient()
    const participantTaskRepo = new ParticipantTaskRepository(prisma)
    const usecase = new UpdateParticipantTaskUseCase(participantTaskRepo)
    await usecase.do({
      participantId,
      taskId,
      progress: updateParticipantTaskDto.progress
    })
  }
}

