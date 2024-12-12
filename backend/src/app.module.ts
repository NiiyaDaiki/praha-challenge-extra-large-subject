import { Module } from '@nestjs/common'
import { ParticipantsController } from './controller/participants/participants.controller'
import { PairsController } from './controller/pairs/pairs.controller'
import { TeamsController } from './controller/teams/teams.controller'
import { ParticipantTasksController } from './controller/participant-task/participant-task.controller'

// memo: DIコンテナとしては使わないため、controllerの追加だけしてください
@Module({
  imports: [],
  controllers: [
    ParticipantsController,
    PairsController,
    TeamsController,
    ParticipantTasksController
  ],
  providers: [],
})
export class AppModule { }
