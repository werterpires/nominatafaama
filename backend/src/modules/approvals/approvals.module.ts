import { Module } from '@nestjs/common'
import { ApprovalsService } from './services/approvals.service'
import { ApprovalsController } from './controllers/approvals.controller'
import { UsersModel } from '../users/ez_model/users.model'
import { StudentsModel } from '../students/model/students.model'
import { SpousesModel } from '../spouses/model/spouses.model'
import { AcademicFormationsModel } from '../info/academic-formations/model/academic-formations.model'
import { LanguagesModel } from '../info/languages/model/languages.model'
import { CoursesModel } from '../info/courses/model/courses.model'
import { PreviousMarriagesModel } from '../info/previous-marriage/model/previous-marriage.model'
import { ProfessionalExperiencesModel } from '../info/professional-experiences/model/professional-experiences.model'
import { PastEclExpsModel } from '../info/past-ecl-experiences/model/past-ecl-experiences.model'

const services = [
  ApprovalsService,
  UsersModel,
  StudentsModel,
  SpousesModel,
  AcademicFormationsModel,
  LanguagesModel,
  CoursesModel,
  PreviousMarriagesModel,
  ProfessionalExperiencesModel,
  PastEclExpsModel,
]

@Module({
  controllers: [ApprovalsController],
  providers: services,
  exports: services,
})
export class ApprovalsModule {}
