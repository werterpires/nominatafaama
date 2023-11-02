import { Module } from '@nestjs/common'
import { StudentPhotosService } from './services/student-photos.service'
import { StudentPhotosController } from './controllers/student-photos.controller'
import { StudentPhotosModel } from './model/student-photos.model'
import { StudentsModule } from 'src/modules/students/students.module'
import { NotificationsModule } from 'src/shared/notifications/notifications.module'

const services = [StudentPhotosService, StudentPhotosModel]

@Module({
  imports: [StudentsModule, NotificationsModule],
  controllers: [StudentPhotosController],
  providers: services,
  exports: services
})
export class StudentPhotosModule {}
