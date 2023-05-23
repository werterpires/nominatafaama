import { Module } from '@nestjs/common';
import { EclExpTypesService } from './services/ecl-exp-types.service';
import { EclExpTypesController } from './controllers/ecl-exp-types.controller';
import { EclExpTypesModel } from './model/ecl-exp-types.model';

const services = [EclExpTypesService, EclExpTypesModel]

@Module({
  controllers: [EclExpTypesController],
  providers: services,
  exports: services
})
export class EclExpTypesModule {}
