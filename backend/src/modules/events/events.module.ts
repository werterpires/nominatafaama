import { Module } from '@nestjs/common'
import { EventsService } from './services/events.service'
import { EventsController } from './controllers/events.controller'
import { EventsModel } from './model/events.model'

const services = [EventsService, EventsModel]

@Module({
  controllers: [EventsController],
  providers: services,
  exports: services,
})
export class EventsModule {}
