import { Module } from '@nestjs/common';
import { AssociationsService } from './services/associations.service';
import { AssociationsController } from './controllers/associations.controller';
import { AssociationsModel } from './model/associations.model';
const services = [
  AssociationsService,
  AssociationsModel
]
@Module({
  controllers: [AssociationsController],
  providers: services,
  exports: services
})
export class AssociationsModule {}
