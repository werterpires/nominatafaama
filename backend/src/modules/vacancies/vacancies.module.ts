import { Module } from '@nestjs/common';
import { VacanciesService } from './services/vacancies.service';
import { VacanciesController } from './controllers/vacancies.controller';
import { VacanciesModel } from './model/vacancies.model';

const services = [VacanciesService, VacanciesModel];

@Module({
  controllers: [VacanciesController],
  providers: services,
  exports: services,
})
export class VacanciesModule {}
