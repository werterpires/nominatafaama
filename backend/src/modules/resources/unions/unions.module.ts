import { Module } from '@nestjs/common';
import { UnionsService } from './services/unions.service';
import { UnionsController } from './controller/unions.controller';
import { UnionsModel } from './model/unions.model';
import { NotificationsModule } from 'src/shared/notifications/notifications.module';

const services = [UnionsService, UnionsModel];

@Module({
  imports: [NotificationsModule],
  controllers: [UnionsController],
  providers: services,
  exports: services,
})
export class UnionsModule {}
