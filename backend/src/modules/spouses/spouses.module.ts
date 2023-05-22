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

const services = [SpousesService,  UsersService, PeopleServices, SpousesModel, UsersModel, PeopleModel, StudentsService, StudentsModel]


@Module({
  controllers: [SpousesController ],
  providers: services,
  exports: services
})
export class SpousesModule {}
