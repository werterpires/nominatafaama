import { Module } from '@nestjs/common';
import { SpousesService } from './services/spouses.service';
import { SpousesController } from './controllers/spouses.controller';
import { UsersService } from '../users/dz_services/users.service';
import { PeopleServices } from '../people/dz_services/people.service';
import { SpousesModel } from './model/spouses.model';
import { UsersModel } from '../users/ez_model/users.model';
import { PeopleModel } from '../people/ez_model/people.model';
import { StudentsService } from '../students/services/students.service';
import { StudentsModel } from '../students/model/students.model';
import { AcademicFormationsModel } from '../info/academic-formations/model/academic-formations.model';
import { LanguagesModel } from '../info/languages/model/languages.model';
import { CoursesModel } from '../info/courses/model/courses.model';
import { ProfessionalExperiencesModel } from '../info/professional-experiences/model/professional-experiences.model';
import { PastEclExpsModel } from '../info/past-ecl-experiences/model/past-ecl-experiences.model';
import { EvangelisticExperiencesModel } from '../info/evangelistic-experiences/model/evang-experiences.model';
import { EclExperiencesModel } from '../info/ecl-experiences/model/ecl-experiences.model';
import { PublicationsModel } from '../info/publications/model/publications.model';
import { EndowmentsModel } from '../info/endowments/model/endowments.model';
import { OrdinationsModel } from '../info/ordinations/model/ordinations.model';
import { RelatedMinistriesModel } from '../info/related-ministries/model/related-ministries.model';
import { PreviousMarriagesModel } from '../info/previous-marriage/model/previous-marriage.model';
import { ChildrenModel } from '../info/children/model/children.model';
import { StudentPhotosService } from '../info/student-photos/services/student-photos.service';
import { StudentPhotosModel } from '../info/student-photos/model/student-photos.model';
import { NotificationsService } from 'src/shared/notifications/services/notifications.service';
import { NotificationsModel } from 'src/shared/notifications/model/notifications.model';

const services = [
  SpousesService,
  UsersService,
  PeopleServices,
  SpousesModel,
  UsersModel,
  PeopleModel,
  StudentsService,
  StudentsModel,
  AcademicFormationsModel,
  LanguagesModel,
  CoursesModel,
  ProfessionalExperiencesModel,
  PastEclExpsModel,
  EvangelisticExperiencesModel,
  EclExperiencesModel,
  PublicationsModel,
  EndowmentsModel,
  OrdinationsModel,
  RelatedMinistriesModel,
  PreviousMarriagesModel,
  ChildrenModel,
  StudentPhotosService,
  StudentPhotosModel,
  NotificationsService,
  NotificationsModel,
];

@Module({
  controllers: [SpousesController],
  providers: services,
  exports: services,
})
export class SpousesModule {}
