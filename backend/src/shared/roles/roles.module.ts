import { Module } from '@nestjs/common';
import { RolesController } from './controllers/roles.controller';
import { FindAllRolesService } from './services/findAllRoles.service';
import { RolesModel } from './model/roles.model';
import { CreateRoleService } from './services/createRole.service';
import { CreateUsersRoleService } from './services/createUsersRole.service';

const services = [
  FindAllRolesService,
  RolesModel,
  CreateRoleService,
  CreateUsersRoleService,
];

@Module({
  imports: [],
  controllers: [RolesController],
  providers: services,
  exports: services,
})
export class RolesModule {}
