import { Module } from '@nestjs/common'
import { NominatasService } from './services/nominatas.service'
import { NominatasController } from './controllers/nominatas.controller'
import { NominatasModel } from './model/nominatas.model'
import { EventsModel } from '../events/model/events.model'

const services = [NominatasService, NominatasModel, EventsModel]

@Module({
  controllers: [NominatasController],
  providers: services,
  exports: services,
})
export class NominatasModule {}
