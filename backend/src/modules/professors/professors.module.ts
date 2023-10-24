import { Module } from '@nestjs/common';
import { PeopleServices } from '../people/dz_services/people.service';
import { PeopleModel } from '../people/ez_model/people.model';
import { UsersService } from '../users/dz_services/users.service';
import { UsersModel } from '../users/ez_model/users.model';
import { SpousesModel } from '../spouses/model/spouses.model';
import { ProfessorsModel } from './model/professors.model';
import { ProfessorsService } from './services/professors.service';
import { ProfessorsController } from './controllers/professors.controller';
import { UsersModule } from '../users/users.module';

const services = [
  ProfessorsModel,
  ProfessorsService,
  PeopleServices,
  PeopleModel,
  SpousesModel,
];

@Module({
  imports: [UsersModule],
  controllers: [ProfessorsController],
  providers: services,
  exports: services,
})
export class ProfessorsModule {}
