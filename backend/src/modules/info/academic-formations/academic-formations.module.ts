import { Module } from '@nestjs/common';
import { AcademicFormationsService } from './services/academic-formations.service';
import { AcademicFormationsController } from './controller/academic-formations.controller';
import { AcademicFormationsModel } from './model/academic-formations.model';
import { UsersService } from 'src/modules/users/dz_services/users.service';
import { UsersModel } from 'src/modules/users/ez_model/users.model';
import { SpousesModel } from 'src/modules/spouses/model/spouses.model';
import { UsersModule } from 'src/modules/users/users.module';

const services = [
  AcademicFormationsService,
  AcademicFormationsModel,
  // UsersService,
  // UsersModel,
  SpousesModel,
];

@Module({
  imports: [UsersModule],
  controllers: [AcademicFormationsController],
  providers: services,
  exports: services,
})
export class AcademicFormationsModule {}
