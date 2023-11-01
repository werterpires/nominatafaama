import { Module } from '@nestjs/common'
import { LanguageTypesService } from './services/language-types.service'
import { LanguageTypesController } from './controllers/language-types.controller'
import { LanguageTypesModel } from './model/language-types.model'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { NotificationsModule } from 'src/shared/notifications/notifications.module'

const services = [LanguageTypesModel, LanguageTypesService]

@Module({
  imports: [NotificationsModule],
  controllers: [LanguageTypesController],
  providers: services,
  exports: services
})
export class LanguageTypesModule {}
