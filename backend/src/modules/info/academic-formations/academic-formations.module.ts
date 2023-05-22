import { Module } from '@nestjs/common';
import { AcademicFormationsService } from './services/academic-formations.service';
import { AcademicFormationsController } from './controller/academic-formations.controller';
import { AcademicFormationsModel } from './model/academic-formations.model';
import { UsersService } from 'src/modules/users/dz_services/users.service';
import { UsersModel } from 'src/modules/users/ez_model/users.model';
import { SpousesModel } from 'src/modules/spouses/model/spouses.model';

const services = [AcademicFormationsService, AcademicFormationsModel, UsersService, UsersModel, SpousesModel]

@Module({
  controllers: [AcademicFormationsController],
  providers: services,
  exports: services,
})
export class AcademicFormationsModule {}
