import { Module } from '@nestjs/common';
import { RelatedMinistriesService } from './services/related-ministries.service';
import { RelatedMinistriesController } from './controller/related-ministries.controller';
import { RelatedMinistriesModel } from './model/related-ministries.model';
import { PeopleServices } from 'src/modules/people/dz_services/people.service';
import { StudentsModel } from 'src/modules/students/model/students.model';
import { UsersModel } from 'src/modules/users/ez_model/users.model';
import { SpousesModel } from 'src/modules/spouses/model/spouses.model';
import { PeopleModel } from 'src/modules/people/ez_model/people.model';
import { UsersService } from 'src/modules/users/dz_services/users.service';
import { UsersModule } from 'src/modules/users/users.module';
const services = [
  RelatedMinistriesService,
  RelatedMinistriesModel,
  PeopleServices,
  PeopleModel,
  StudentsModel,

  SpousesModel,
];
@Module({
  imports: [UsersModule],
  controllers: [RelatedMinistriesController],
  providers: services,
  exports: services,
})
export class RelatedMinistriesModule {}
