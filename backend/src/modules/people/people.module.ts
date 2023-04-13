import { Module } from '@nestjs/common';
import { PeopleController } from './controllers/people.controller';
import { FindAllPeopleService } from './services/findAllPeople.service';
import { PeopleModel } from './model/people.model';
import { CreatePersonService } from './services/createPerson.service';
import { AddressesModel } from '../addresses/model/addresses.model';

const services = [FindAllPeopleService, PeopleModel, CreatePersonService, AddressesModel];

@Module({
  imports: [],
  controllers: [PeopleController],
  providers: services,
  exports: services,
})
export class PeopleModule {}
