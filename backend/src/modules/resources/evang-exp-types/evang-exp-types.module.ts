import { Module } from '@nestjs/common';
import { EvangExpTypesService } from './services/evang-exp-types.service';
import { EvangExpTypesController } from './controllers/evang-exp-types.controller';
import { EvangExpTypesModel } from './model/evang-exp-types.model';

const services = [EvangExpTypesService, EvangExpTypesModel]

@Module({
  controllers: [EvangExpTypesController],
  providers: services,
  exports: services
})
export class EvangExpTypesModule {}
