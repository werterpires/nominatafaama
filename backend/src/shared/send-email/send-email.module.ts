import { Module } from '@nestjs/common'
import { SendEmailService } from './send-email.service'
import { SendEmailController } from './send-email.controller'
import { NotificationsModel } from '../notifications/model/notifications.model'
import { InvitesModel } from 'src/modules/invites/model/invites.model'
import { NotificationsService } from '../notifications/services/notifications.service'

@Module({
  controllers: [SendEmailController],
  providers: [SendEmailService, NotificationsModel, InvitesModel, NotificationsService]
})
export class SendEmailModule {}
