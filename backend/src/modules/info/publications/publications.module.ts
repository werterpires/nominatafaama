import { Module } from '@nestjs/common';
import { PublicationsService } from './services/publications.service';
import { PublicationsController } from './controlllers/publications.controller';
import { PublicationsModel } from './model/publications.model';
import { PeopleServices } from 'src/modules/people/dz_services/people.service';
import { PeopleModel } from 'src/modules/people/ez_model/people.model';
import { UsersModel } from 'src/modules/users/ez_model/users.model';
import { SpousesModel } from 'src/modules/spouses/model/spouses.model';
import { UsersService } from 'src/modules/users/dz_services/users.service';
import { UsersModule } from 'src/modules/users/users.module';

const services = [
  PublicationsService,
  PublicationsModel,
  PeopleServices,
  PeopleModel,

  SpousesModel,
];

@Module({
  imports: [UsersModule],
  controllers: [PublicationsController],
  providers: services,
  exports: services,
})
export class PublicationsModule {}
