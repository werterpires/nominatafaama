import {Module} from '@nestjs/common'
import {EndowmentsController} from './controllers/endowments.controller'
import {EndowmentsService} from './services/endowments.service'
import {EndowmentsModel} from './model/endowments.model'
import {PeopleServices} from 'src/modules/people/dz_services/people.service'
import {PeopleModel} from 'src/modules/people/ez_model/people.model'
import {UsersModel} from 'src/modules/users/ez_model/users.model'
import {SpousesModel} from 'src/modules/spouses/model/spouses.model'

const services = [
  EndowmentsService,
  EndowmentsModel,
  PeopleServices,
  PeopleModel,
  UsersModel,
  SpousesModel,
]

@Module({
  controllers: [EndowmentsController],
  providers: services,
  exports: services,
})
export class EndowmentsModule {}
