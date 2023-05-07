import { Module } from '@nestjs/common';
import { RolesController } from './cz_controllers/roles.controller';
import { RolesService } from './dz_services/roles.service';
import { RolesModel } from './ez_model/roles.model';

const services = [
  RolesService,
  RolesModel,
];

@Module({
  imports: [],
  controllers: [RolesController],
  providers: services,
  exports: services,
})
export class RolesModule {}
