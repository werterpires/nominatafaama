import { Module } from '@nestjs/common'
import { OtherInvitesTimesService } from './services/other-invites-times.service'
import { OtherInvitesTimesController } from './controllers/other-invites-times.controller'
import { OtherInvitesTimesModel } from './model/other-invites-times.model'

const services = [OtherInvitesTimesService, OtherInvitesTimesModel]
@Module({
  controllers: [OtherInvitesTimesController],
  providers: services,
  exports: services
})
export class OtherInvitesTimesModule {}
