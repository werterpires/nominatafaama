import { Module } from '@nestjs/common';
import { PastEclExpsService } from './services/past-ecl-experiences.service';
import { PastEclExpsController } from './controllers/past-ecl-experiences.controller';
import { PastEclExpsModel } from './model/past-ecl-experiences.model';
import { UsersService } from 'src/modules/users/dz_services/users.service';
import { UsersModel } from 'src/modules/users/ez_model/users.model';
import { SpousesModel } from 'src/modules/spouses/model/spouses.model';
import { UsersModule } from 'src/modules/users/users.module';

const services = [PastEclExpsService, PastEclExpsModel, SpousesModel];

@Module({
  imports: [UsersModule],
  controllers: [PastEclExpsController],
  providers: services,
  exports: services,
})
export class PastEclExperiencesModule {}
