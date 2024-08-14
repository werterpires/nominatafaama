import { Module } from '@nestjs/common'
import { NominataPhotosService } from './nominata-photos.service'
import { NominataPhotosController } from './nominata-photos.controller'
import { NominatasPhotosModel } from './nominata-photos.model'
import { NominatasModel } from '../nominatas/model/nominatas.model'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { NotificationsModel } from 'src/shared/notifications/model/notifications.model'

const services = [
  NominataPhotosService,
  NominatasPhotosModel,
  NominatasModel,
  NotificationsService,
  NotificationsModel
]
@Module({
  controllers: [NominataPhotosController],
  providers: services
})
export class NominataPhotosModule {}
