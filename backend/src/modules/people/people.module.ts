import { Module } from '@nestjs/common';
import { PeopleServices } from './dz_services/people.service';
import { PeopleModel } from './ez_model/people.model';
import { PeopleController } from './cz_controllers/people.controller';

const services = [PeopleServices, PeopleModel];

@Module({
  imports: [],
  controllers: [PeopleController],
  providers: services,
  exports: services,
})
export class PeopleModule {}
