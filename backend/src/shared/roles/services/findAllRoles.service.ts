import { Injectable } from '@nestjs/common';
import { RolesModel } from '../model/roles.model';

@Injectable()
export class FindAllRolesService {
  constructor(private readonly rolesModel: RolesModel) {}

  async findAllRoles() {
    const allRoles = await this.rolesModel.findAllRoles();
    return allRoles;
  }
}
