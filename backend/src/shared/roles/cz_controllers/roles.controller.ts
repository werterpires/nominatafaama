import { Body, Controller, Get, Post } from '@nestjs/common';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { Roles } from '../fz_decorators/roles.decorator';
import { RolesService } from '../dz_services/roles.service';
import { IsPublic } from 'src/shared/auth/decorators/is-public.decorator';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
  ) {}

  @IsPublic()
  @Get()
  async findAllRoles() {
    return await this.rolesService.findAllRoles();
  }

}
