import {Module} from '@nestjs/common'
import {LanguagesService} from './services/languages.service'
import {LanguagesController} from './controllers/languages.controller'
import {LanguagesModel} from './model/languages.model'
import {UsersService} from 'src/modules/users/dz_services/users.service'
import {SpousesModel} from 'src/modules/spouses/model/spouses.model'
import {UsersModel} from 'src/modules/users/ez_model/users.model'

const services = [
  LanguagesService,
  LanguagesModel,
  UsersService,
  SpousesModel,
  UsersModel,
]

@Module({
  controllers: [LanguagesController],
  providers: services,
  exports: services,
})
export class LanguagesModule {}
