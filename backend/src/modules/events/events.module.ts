import { Module } from '@nestjs/common'
import { EventsService } from './services/events.service'
import { EventsController } from './controllers/events.controller'
import { EventsModel } from './model/events.model'
import { NotificationsModule } from 'src/shared/notifications/notifications.module'

const services = [EventsService, EventsModel]

@Module({
  imports: [NotificationsModule],
  controllers: [EventsController],
  providers: services,
  exports: services
})
export class EventsModule {}
