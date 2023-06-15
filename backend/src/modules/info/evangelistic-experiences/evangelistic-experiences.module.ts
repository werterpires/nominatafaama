import { Module } from '@nestjs/common'
import { EvangelisticExperiencesService } from './services/evangelistic-experiences.service'
import { EvangelisticExperiencesController } from './controllers/evangelistic-experiences.controller'
import { EvangelisticExperiencesModel } from './model/evang-experiences.model'
import { UsersService } from 'src/modules/users/dz_services/users.service'
import { UsersModel } from 'src/modules/users/ez_model/users.model'
import { SpousesModel } from 'src/modules/spouses/model/spouses.model'

const services = [
  EvangelisticExperiencesService,
  EvangelisticExperiencesModel,
  UsersService,
  UsersModel,
  SpousesModel,
]

@Module({
  controllers: [EvangelisticExperiencesController],
  providers: services,
  exports: services,
})
export class EvangelisticExperiencesModule {}
