import { Module } from '@nestjs/common'
import { PublicationTypesService } from './services/publication-types.service'
import { PublicationTypesController } from './controllers/publication-types.controller'
import { PublicationTypeModel } from './model/publication-types.model'
import { NotificationsModule } from 'src/shared/notifications/notifications.module'

const services = [PublicationTypesService, PublicationTypeModel]

@Module({
  imports: [NotificationsModule],
  controllers: [PublicationTypesController],
  providers: services,
  exports: services
})
export class PublicationTypesModule {}
