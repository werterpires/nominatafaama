import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '../dto/createRolesDto';
import { RolesModel } from '../model/roles.model';

@Injectable()
export class CreateRoleService {
  constructor(private readonly rolesModel: RolesModel) {}

  async createRole({ roleName, roleDescription }: CreateRoleDto) {
    const role = await this.rolesModel.createRole({
      roleName,
      roleDescription,
    });
    return role;
  }
}
