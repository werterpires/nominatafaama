import {Module} from '@nestjs/common'
import {ProfessionalExperiencesService} from './services/professional-experiences.service'
import {ProfessionalExperiencesController} from './controllers/professional-experiences.controller'
import {ProfessionalExperiencesModel} from './model/professional-experiences.model'
import {UsersService} from 'src/modules/users/dz_services/users.service'
import {SpousesModel} from 'src/modules/spouses/model/spouses.model'
import {UsersModel} from 'src/modules/users/ez_model/users.model'

const services = [
  ProfessionalExperiencesService,
  ProfessionalExperiencesModel,
  UsersService,
  UsersModel,
  SpousesModel,
]

@Module({
  controllers: [ProfessionalExperiencesController],
  providers: services,
  exports: services,
})
export class ProfessionalExperiencesModule {}
