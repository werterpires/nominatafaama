import { Module } from '@nestjs/common'
import { MinistryTypesService } from './services/ministry-types.service'
import { MinistryTypesController } from './controllers/ministry-types.controller'
import { MinistryTypesModel } from './model/ministry-types.model'
import { NotificationsModule } from 'src/shared/notifications/notifications.module'

const services = [MinistryTypesService, MinistryTypesModel]

@Module({
  imports: [NotificationsModule],
  controllers: [MinistryTypesController],
  providers: services,
  exports: services
})
export class MinistryTypesModule {}
