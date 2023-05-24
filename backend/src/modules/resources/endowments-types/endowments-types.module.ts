import { Module } from '@nestjs/common';
import { EndowmentTypesService } from './services/endowments-types.service';
import { EndowmentsTypesController } from './controllers/endowments-types.controller';
import { EndowmentTypesModel } from './model/endowments-types.model';

const services= [EndowmentTypesService, EndowmentTypesModel]

@Module({
  controllers: [EndowmentsTypesController],
  providers: services,
  exports: services
})
export class EndowmentsTypesModule {}
