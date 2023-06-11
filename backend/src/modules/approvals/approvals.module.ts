import { Module } from '@nestjs/common'
import { ApprovalsService } from './services/approvals.service'
import { ApprovalsController } from './controllers/approvals.controller'
import { UsersModel } from '../users/ez_model/users.model'
import { StudentsModel } from '../students/model/students.model'
import { SpousesModel } from '../spouses/model/spouses.model'
import { AcademicFormationsModel } from '../info/academic-formations/model/academic-formations.model'
import { LanguagesModel } from '../info/languages/model/languages.model'

const services = [
  ApprovalsService,
  UsersModel,
  StudentsModel,
  SpousesModel,
  AcademicFormationsModel,
  LanguagesModel,
]

@Module({
  controllers: [ApprovalsController],
  providers: services,
  exports: services,
})
export class ApprovalsModule {}
