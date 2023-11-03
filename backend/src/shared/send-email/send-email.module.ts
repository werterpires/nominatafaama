import { Module } from '@nestjs/common'
import { SendEmailService } from './send-email.service'
import { SendEmailController } from './send-email.controller'
import { NotificationsModel } from '../notifications/model/notifications.model'

@Module({
  controllers: [SendEmailController],
  providers: [SendEmailService, NotificationsModel]
})
export class SendEmailModule {}
