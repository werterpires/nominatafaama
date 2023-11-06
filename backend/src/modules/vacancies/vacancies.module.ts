import { Module } from '@nestjs/common';
import { VacanciesService } from './services/vacancies.service';
import { VacanciesController } from './controllers/vacancies.controller';
import { VacanciesModel } from './model/vacancies.model';
import { NotificationsModule } from 'src/shared/notifications/notifications.module';

const services = [VacanciesService, VacanciesModel];

@Module({
  imports: [NotificationsModule],
  controllers: [VacanciesController],
  providers: services,
  exports: services,
})
export class VacanciesModule {}
