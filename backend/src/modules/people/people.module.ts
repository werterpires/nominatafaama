import {Module} from '@nestjs/common'
import {PeopleServices} from './dz_services/people.service'
import {PeopleModel} from './ez_model/people.model'
import {PeopleController} from './cz_controllers/people.controller'
import {UsersModel} from '../users/ez_model/users.model'
import {SpousesModel} from '../spouses/model/spouses.model'

const services = [PeopleServices, PeopleModel, UsersModel, SpousesModel]

@Module({
  imports: [],
  controllers: [PeopleController],
  providers: services,
  exports: services,
})
export class PeopleModule {}
