import { Module } from '@nestjs/common';
import { OtherInvitesTimesService } from './other-invites-times.service';
import { OtherInvitesTimesController } from './other-invites-times.controller';

@Module({
  controllers: [OtherInvitesTimesController],
  providers: [OtherInvitesTimesService]
})
export class OtherInvitesTimesModule {}
