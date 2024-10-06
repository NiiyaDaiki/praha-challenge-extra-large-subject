import { Module } from '@nestjs/common'
import { SampleController } from './controller/sample/some-data.controller'
import { ParticipantsController } from './controller/participants/participants.controller'
import { PairsController } from './controller/pairs/pairs.controller'

// memo: DIコンテナとしては使わないため、controllerの追加だけしてください
@Module({
  imports: [],
  controllers: [SampleController, ParticipantsController, PairsController],
  providers: [],
})
export class AppModule { }
