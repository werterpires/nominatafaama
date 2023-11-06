import { Module } from '@nestjs/common';
import { ChildrenService } from './services/children.service';
import { ChildrenController } from './controllers/children.controller';
import { ChildrenModel } from './model/children.model';
import { NotificationsModule } from 'src/shared/notifications/notifications.module';
import { StudentsModule } from 'src/modules/students/students.module';

const services = [ChildrenService, ChildrenModel];

@Module({
  imports: [NotificationsModule, StudentsModule],
  controllers: [ChildrenController],
  providers: services,
  exports: services,
})
export class ChildrenModule {}
