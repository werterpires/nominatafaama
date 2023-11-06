import { Module } from '@nestjs/common';
import { HiringStatusService } from './services/hiring-status.service';
import { HiringStatusController } from './controller/hiring-status.controller';
import { HiringStatusModel } from './model/hiring-status.model';
import { NotificationsModule } from 'src/shared/notifications/notifications.module';

const services = [HiringStatusModel, HiringStatusService];

@Module({
  imports: [NotificationsModule],
  controllers: [HiringStatusController],
  providers: services,
  exports: services,
})
export class HiringStatusModule {}
