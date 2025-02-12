import { Module } from '@nestjs/common'
import { ParticipantsController } from './controller/participants/participants.controller'
import { PairsController } from './controller/pairs/pairs.controller'
import { TeamsController } from './controller/teams/teams.controller'
import { ParticipantTasksController } from './controller/participant-task/participant-task.controller'
import { TasksController } from './controller/tasks/tasks.controller'

// memo: DIコンテナとしては使わないため、controllerの追加だけしてください
@Module({
  imports: [],
  controllers: [
    ParticipantsController,
    PairsController,
    TeamsController,
    ParticipantTasksController,
    TasksController
  ],
  providers: [],
})
export class AppModule { }
