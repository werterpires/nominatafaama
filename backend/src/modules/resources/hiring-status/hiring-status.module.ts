import { Module } from '@nestjs/common';
import { HiringStatusService } from './services/hiring-status.service';
import { HiringStatusController } from './controller/hiring-status.controller';
import { HiringStatusModel } from './model/hiring-status.model';

const services = [HiringStatusModel, HiringStatusService ]


@Module({
  controllers: [HiringStatusController],
  providers: services,
  exports: services

})
export class HiringStatusModule {}
