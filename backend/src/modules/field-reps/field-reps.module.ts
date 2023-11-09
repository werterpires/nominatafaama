import { Module } from '@nestjs/common'
import { FieldRepsService } from './services/field-reps.service'
import { FieldRepsController } from './controllers/field-reps.controller'
import { FieldRepsModel } from './model/field-reps.model'
import { PeopleModule } from '../people/people.module'
import { UsersModule } from '../users/users.module'
import { FavoritesModel } from './model/favorites.model'
import { FavoritesService } from './services/favorites.service'

const services = [
  FieldRepsService,
  FieldRepsModel,
  FavoritesModel,
  FavoritesService
]

@Module({
  imports: [PeopleModule, UsersModule],
  controllers: [FieldRepsController],
  providers: services,
  exports: services
})
export class FieldRepsModule {}
