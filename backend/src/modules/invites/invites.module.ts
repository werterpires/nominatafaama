import { Module } from '@nestjs/common'
import { InvitesService } from './services/invites.service'
import { InvitesController } from './invites.controller'
import { InvitesModel } from './model/invites.model'
import { VacanciesService } from '../vacancies/services/vacancies.service'
import { NotificationsModule } from 'src/shared/notifications/notifications.module'
import { VacanciesModel } from '../vacancies/model/vacancies.model'
import { VacanciesModule } from '../vacancies/vacancies.module'
import { StudentsModel } from '../students/model/students.model'

const services = [InvitesService, InvitesModel, StudentsModel]

@Module({
  imports: [NotificationsModule, VacanciesModule],
  controllers: [InvitesController],
  providers: services,
  exports: services
})
export class InvitesModule {}
