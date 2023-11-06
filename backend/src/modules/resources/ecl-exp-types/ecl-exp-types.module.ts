import { Module } from '@nestjs/common'
import { EclExpTypesService } from './services/ecl-exp-types.service'
import { EclExpTypesController } from './controllers/ecl-exp-types.controller'
import { EclExpTypesModel } from './model/ecl-exp-types.model'
import { NotificationsModule } from 'src/shared/notifications/notifications.module'

const services = [EclExpTypesService, EclExpTypesModel]

@Module({
  imports: [NotificationsModule],
  controllers: [EclExpTypesController],
  providers: services,
  exports: services
})
export class EclExpTypesModule {}
