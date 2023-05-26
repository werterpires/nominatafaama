import {Module} from '@nestjs/common'
import {CoursesService} from './services/courses.service'
import {CoursesController} from './controllers/courses.controller'
import {CoursesModel} from './model/courses.model'
import {UsersService} from 'src/modules/users/dz_services/users.service'
import {UsersModel} from 'src/modules/users/ez_model/users.model'
import {SpousesModel} from 'src/modules/spouses/model/spouses.model'

const services = [
  CoursesService,
  CoursesModel,
  UsersService,
  UsersModel,
  SpousesModel,
]

@Module({
  controllers: [CoursesController],
  providers: services,
  exports: services,
})
export class CoursesModule {}
