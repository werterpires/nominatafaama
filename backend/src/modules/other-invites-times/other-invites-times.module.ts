import { Module } from '@nestjs/common'
import { OtherInvitesTimesService } from './services/other-invites-times.service'
import { OtherInvitesTimesController } from './controllers/other-invites-times.controller'

@Module({
  controllers: [OtherInvitesTimesController],
  providers: [OtherInvitesTimesService]
})
export class OtherInvitesTimesModule {}
