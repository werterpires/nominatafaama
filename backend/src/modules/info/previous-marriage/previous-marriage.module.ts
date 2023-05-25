import {Module} from '@nestjs/common'
import {PreviousMarriagesService} from './services/previous-marriage.service'
import {PreviousMarriagesController} from './controllers/previous-marriage.controller'
import {PreviousMarriagesModel} from './model/previous-marriage.model'
import {StudentsModel} from 'src/modules/students/model/students.model'

const services = [
  PreviousMarriagesService,
  PreviousMarriagesModel,
  StudentsModel,
]

@Module({
  controllers: [PreviousMarriagesController],
  providers: services,
  exports: services,
})
export class PreviousMarriageModule {}
