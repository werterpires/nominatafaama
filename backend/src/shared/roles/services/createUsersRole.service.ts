import { Injectable } from '@nestjs/common';
import { CreateUsersRoleDto } from '../dto/createUsersRolesDto';
import { RolesModel } from '../model/roles.model';

@Injectable()
export class CreateUsersRoleService {
  constructor(private readonly rolesModel: RolesModel) {}

  async createUsersRole({ userId, roleId }: CreateUsersRoleDto) {
    const usersrole = await this.rolesModel.createUsersRole({
      userId,
      roleId,
    });
    return usersrole;
  }
}
