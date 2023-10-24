import { Module } from '@nestjs/common';
import { NotificationsService } from './services/notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsModel } from './model/notifications.model';

const services = [NotificationsService, NotificationsModel];

@Module({
  controllers: [NotificationsController],
  providers: services,
  exports: services,
})
export class NotificationsModule {}
