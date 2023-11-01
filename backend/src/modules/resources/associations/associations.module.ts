import { Module } from '@nestjs/common';
import { AssociationsService } from './services/associations.service';
import { AssociationsController } from './controllers/associations.controller';
import { AssociationsModel } from './model/associations.model';
import { NotificationsModule } from 'src/shared/notifications/notifications.module';
const services = [AssociationsService, AssociationsModel];
@Module({
  imports: [NotificationsModule],
  controllers: [AssociationsController],
  providers: services,
  exports: services,
})
export class AssociationsModule {}
