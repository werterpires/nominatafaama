import { Module } from '@nestjs/common'
import { NominatasService } from './services/nominatas.service'
import { NominatasController } from './controllers/nominatas.controller'
import { NominatasModel } from './model/nominatas.model'
import { EventsModel } from '../events/model/events.model'
import { NotificationsModule } from 'src/shared/notifications/notifications.module'
import { NominatasPhotosModel } from '../nominata-photos/nominata-photos.model'

const services = [
  NominatasService,
  NominatasModel,
  EventsModel,
  NominatasPhotosModel
]

@Module({
  imports: [NotificationsModule],
  controllers: [NominatasController],
  providers: services,
  exports: services
})
export class NominatasModule {}
