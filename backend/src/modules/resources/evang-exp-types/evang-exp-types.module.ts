import { Module } from '@nestjs/common'
import { EvangExpTypesService } from './services/evang-exp-types.service'
import { EvangExpTypesController } from './controllers/evang-exp-types.controller'
import { EvangExpTypesModel } from './model/evang-exp-types.model'
import { NotificationsModule } from 'src/shared/notifications/notifications.module'

const services = [EvangExpTypesService, EvangExpTypesModel]

@Module({
  imports: [NotificationsModule],
  controllers: [EvangExpTypesController],
  providers: services,
  exports: services
})
export class EvangExpTypesModule {}
