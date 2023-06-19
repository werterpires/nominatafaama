import {Module} from '@nestjs/common'
import {OrdinationsService} from './services/ordinations.service'
import {OrdinationsController} from './controllers/ordinations.controller'
import {OrdinationsModel} from './model/ordinations.model'
import {PeopleServices} from 'src/modules/people/dz_services/people.service'
import {StudentsModel} from 'src/modules/students/model/students.model'
import {SpousesModel} from 'src/modules/spouses/model/spouses.model'
import {PeopleModel} from 'src/modules/people/ez_model/people.model'
import {UsersModel} from 'src/modules/users/ez_model/users.model'
import { UsersService } from 'src/modules/users/dz_services/users.service'

const services = [
  OrdinationsService,
  OrdinationsModel,
  PeopleServices,
  UsersModel,
  PeopleModel,
  StudentsModel,
  SpousesModel,
  UsersService
]

@Module({
  controllers: [OrdinationsController],
  providers: services,
  exports: services,
})
export class OrdinationsModule {}
