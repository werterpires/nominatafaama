import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { ICreateRole, ICreateUsersRole, IRole, IUsersRole } from '../types';

@Injectable()
export class RolesModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createUsersRole({ userId, roleId }: ICreateUsersRole) {
    const usersRole: IUsersRole = await this.knex.table('users_roles').insert({
      role_id: roleId,
      user_id: userId,
    });

    return usersRole;
  }

  async findAllRoles() {
    const allRoles: IRole[] = await this.knex.table('roles as r');

    return allRoles;
  }

  async createRole({ roleName, roleDescription }: ICreateRole) {
    const role: IRole = await this.knex.table('roles').insert({
      role_name: roleName,
      role_description: roleDescription,
    });

    return role;
  }
}
