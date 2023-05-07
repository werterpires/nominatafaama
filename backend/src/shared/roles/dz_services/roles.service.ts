import { Injectable } from '@nestjs/common';
import { RolesModel } from '../ez_model/roles.model';

@Injectable()
export class RolesService {
  constructor(private readonly rolesModel: RolesModel) {}

  async findAllRoles() {
    const allRoles = await this.rolesModel.findAllRoles();
    return allRoles;
  }
}
