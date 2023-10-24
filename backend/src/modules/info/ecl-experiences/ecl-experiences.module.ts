import { Module } from '@nestjs/common';
import { EclExperiencesService } from './services/ecl-experiences.service';
import { EclExperiencesController } from './controllers/ecl-experiences.controller';
import { EclExperiencesModel } from './model/ecl-experiences.model';
import { SpousesModel } from 'src/modules/spouses/model/spouses.model';
import { UsersService } from 'src/modules/users/dz_services/users.service';
import { UsersModel } from 'src/modules/users/ez_model/users.model';
import { UsersModule } from 'src/modules/users/users.module';

const services = [EclExperiencesService, EclExperiencesModel, SpousesModel];

@Module({
  imports: [UsersModule],
  controllers: [EclExperiencesController],
  providers: services,
  exports: services,
})
export class EclExperiencesModule {}
