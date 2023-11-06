import { Module } from '@nestjs/common'
import { MaritalStatusService } from './services/marital-status.service'
import { MaritalStatusController } from './controllers/marital-status.controller'
import { MaritalStatusModel } from './model/marital-status.model'
import { NotificationsModule } from 'src/shared/notifications/notifications.module'

const services = [MaritalStatusService, MaritalStatusModel]

@Module({
  imports: [NotificationsModule],
  controllers: [MaritalStatusController],
  providers: services,
  exports: services
})
export class MaritalStatusModule {}
