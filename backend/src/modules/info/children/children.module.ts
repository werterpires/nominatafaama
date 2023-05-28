import {Module} from '@nestjs/common'
import {ChildrenService} from './services/children.service'
import {ChildrenController} from './controllers/children.controller'
import {ChildrenModel} from './model/children.model'
import {StudentsModel} from 'src/modules/students/model/students.model'

const services = [ChildrenService, ChildrenModel, StudentsModel]

@Module({
  controllers: [ChildrenController],
  providers: services,
  exports: services,
})
export class ChildrenModule {}
