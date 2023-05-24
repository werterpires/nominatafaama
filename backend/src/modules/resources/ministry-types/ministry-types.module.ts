import { Module } from '@nestjs/common';
import { MinistryTypesService } from './services/ministry-types.service';
import { MinistryTypesController } from './controllers/ministry-types.controller';
import { MinistryTypesModel } from './model/ministry-types.model';

const services = [MinistryTypesService, MinistryTypesModel]

@Module({
  controllers: [MinistryTypesController],
  providers: services,
  exports: services
})
export class MinistryTypesModule {}
