import { Module } from '@nestjs/common';
import { StudentsService } from './services/students.service';
import { StudentsController } from './controllers/students.controller';
import { StudentsModel } from './model/students.model';
import { PeopleServices } from '../people/dz_services/people.service';
import { PeopleModel } from '../people/ez_model/people.model';
import { UsersService } from '../users/dz_services/users.service';
import { UsersModel } from '../users/ez_model/users.model';

const services = [StudentsModel, StudentsService, PeopleServices, PeopleModel, UsersService, UsersModel]

@Module({
  controllers: [StudentsController],
  providers: services,
  exports: services
})
export class StudentsModule {}
