import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { IRole } from '../bz_types/types';

@Injectable()
export class RolesModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async findAllRoles(): Promise<IRole[]> {
    let roles: IRole[] = [];
  
    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx.table('roles').select('*');
  
        roles = results as IRole[];
  
        await trx.commit();
      } catch (error) {
        await trx.rollback();
  
        throw error;
      }
    });
  
    return roles;
  }
  

}
