import { Module } from '@nestjs/common';
import { UsersController } from './cz_controllers/users.controller';
import { UsersService } from './dz_services/users.service';
import { UsersModel } from './ez_model/users.model';
import { NotificationsService } from 'src/shared/notifications/services/notifications.service';
import { NotificationsModel } from 'src/shared/notifications/model/notifications.model';
import { NotificationsModule } from 'src/shared/notifications/notifications.module';

const services = [
  UsersService,
  UsersModel,
  NotificationsService,
  NotificationsModel,
];

@Module({
  imports: [NotificationsModule],
  controllers: [UsersController],
  providers: services,
  exports: services,
})
export class UsersModule {}
