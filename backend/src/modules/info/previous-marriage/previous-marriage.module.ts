import { Module } from '@nestjs/common';
import { PreviousMarriagesService } from './services/previous-marriage.service';
import { PreviousMarriagesController } from './controllers/previous-marriage.controller';
import { PreviousMarriagesModel } from './model/previous-marriage.model';
import { StudentsModel } from 'src/modules/students/model/students.model';
import { StudentsModule } from 'src/modules/students/students.module';
import { NotificationsModule } from 'src/shared/notifications/notifications.module';

const services = [PreviousMarriagesService, PreviousMarriagesModel];

@Module({
  imports: [StudentsModule, NotificationsModule],
  controllers: [PreviousMarriagesController],
  providers: services,
  exports: services,
})
export class PreviousMarriageModule {}
