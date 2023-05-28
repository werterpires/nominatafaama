import {Module} from '@nestjs/common'
import {PublicationsService} from './services/publications.service'
import {PublicationsController} from './controlllers/publications.controller'
import {PublicationsModel} from './model/publications.model'
import {PeopleServices} from 'src/modules/people/dz_services/people.service'
import {PeopleModel} from 'src/modules/people/ez_model/people.model'
import {UsersModel} from 'src/modules/users/ez_model/users.model'
import {SpousesModel} from 'src/modules/spouses/model/spouses.model'

const services = [
  PublicationsService,
  PublicationsModel,
  PeopleServices,
  PeopleModel,
  UsersModel,
  SpousesModel,
]

@Module({
  controllers: [PublicationsController],
  providers: services,
  exports: services,
})
export class PublicationsModule {}
