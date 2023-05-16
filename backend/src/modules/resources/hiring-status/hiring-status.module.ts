import { Module } from '@nestjs/common';
import { HiringStatusService } from './hiring-status.service';
import { HiringStatusController } from './hiring-status.controller';

@Module({
  controllers: [HiringStatusController],
  providers: [HiringStatusService]
})
export class HiringStatusModule {}
