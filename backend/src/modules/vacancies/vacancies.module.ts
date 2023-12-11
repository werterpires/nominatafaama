import { Module } from '@nestjs/common'
import { VacanciesService } from './services/vacancies.service'
import { VacanciesController } from './controllers/vacancies.controller'
import { VacanciesModel } from './model/vacancies.model'
import { NotificationsModule } from 'src/shared/notifications/notifications.module'
import { FieldRepresentationsModel } from '../field-representations/model/field-representations.model'

const services = [VacanciesService, VacanciesModel, FieldRepresentationsModel]

@Module({
  imports: [NotificationsModule],
  controllers: [VacanciesController],
  providers: services,
  exports: services
})
export class VacanciesModule {}
