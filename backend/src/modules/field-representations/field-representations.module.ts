import { Module } from '@nestjs/common'
import { FieldRepresentationsService } from './services/field-representations.service'
import { FieldRepresentationsController } from './controller/field-representations.controller'
import { FieldRepsModule } from '../field-reps/field-reps.module'
import { FieldRepresentationsModel } from './model/field-representations.model'
import { NotificationsModule } from 'src/shared/notifications/notifications.module'

const services = [FieldRepresentationsService, FieldRepresentationsModel]

@Module({
  imports: [FieldRepsModule, NotificationsModule],
  controllers: [FieldRepresentationsController],
  providers: services,
  exports: services
})
export class FieldRepresentationsModule {}
