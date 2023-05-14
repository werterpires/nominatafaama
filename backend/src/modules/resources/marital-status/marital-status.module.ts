import { Module } from '@nestjs/common';
import { MaritalStatusService } from './services/marital-status.service';
import { MaritalStatusController } from './controllers/marital-status.controller';
import { MaritalStatusModel } from './model/marital-status.model';

const services = [
  MaritalStatusService,
  MaritalStatusModel,
];

@Module({
  imports:[],
  controllers: [MaritalStatusController],
  providers: services,
  exports: services
})
export class MaritalStatusModule {}
