import { Module } from '@nestjs/common';
import { AcademicDegreesService } from './services/academic-degrees.service';
import { AcademicDegreesController } from './controllers/academic-degrees.controller';
import { AcademicDegreesModel } from './model/academic-degrees.model';
import { NotificationsModule } from 'src/shared/notifications/notifications.module';

const services = [AcademicDegreesService, AcademicDegreesModel];

@Module({
  imports: [NotificationsModule],
  controllers: [AcademicDegreesController],
  providers: services,
  exports: services,
})
export class AcademicDegreesModule {}
