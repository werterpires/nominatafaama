import { Body, Controller, Get, Post } from '@nestjs/common';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { Roles } from '../decorators/roles.decorator';
import { CreateRoleDto } from '../dto/createRolesDto';
import { CreateUsersRoleDto } from '../dto/createUsersRolesDto';
import { CreateRoleService } from '../services/createRole.service';
import { CreateUsersRoleService } from '../services/createUsersRole.service';
import { FindAllRolesService } from '../services/findAllRoles.service';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly findAllRolesService: FindAllRolesService,
    private readonly createRoleService: CreateRoleService,
    private readonly createUsersRoleService: CreateUsersRoleService,
  ) { }

  @Roles(ERoles.ADMINISTRADOR, ERoles.PROPRIETARIO)
  @Get()
  async findAllRoles() {
    return await this.findAllRolesService.findAllRoles();
  }

  @Roles(ERoles.ADMINISTRADOR)
  @Post()
  async createRole(@Body() input: CreateRoleDto) {
    return await this.createRoleService.createRole(input);
  }

  @Roles(ERoles.ADMINISTRADOR)
  @Post('usersroles')
  async createUsersRole(@Body() input: CreateUsersRoleDto) {
    return await this.createUsersRoleService.createUsersRole(input);
  }
}
