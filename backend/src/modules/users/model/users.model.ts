import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { IRole } from 'src/shared/roles/types';
import { ICreateUser, IUser } from '../types';

@Injectable()
export class UsersModel {
  constructor(@InjectModel() private readonly knex: Knex) {}
  async findAllUsers() {
    const allUsers: IUser[] = await this.knex
      .table('users as u')
      .select('u.user_id', 'p.*', 'a.*', 'r.*')
      .leftJoin('people as p', 'u.person_id', 'p.person_id')
      .leftJoin('addresses as a', 'p.address_id', 'a.address_id')
      .leftJoin('users_roles as ur', 'u.user_id', 'ur.user_id')
      .leftJoin('roles as r', 'ur.role_id', '=', 'r.role_id');

    return allUsers;
  }

  

  async findUserByEmail(email: string) {
    const user: IUser[] = await this.knex
      .table('users as u')
      .leftJoin('people as p', 'u.person_id', 'p.person_id')
      .leftJoin('users_roles as ur', 'u.user_id', 'ur.user_id')
      .leftJoin('roles as r', 'ur.role_id', '=', 'r.role_id')
      .where('p.email', email);
    return user;
  }

  async createUser({ passwordHash, personId, rolesId }: ICreateUser) {
    const user: IUser = await this.knex.table('users').insert({
      password_hash: passwordHash,
      person_id: personId,
    });
    
    rolesId.forEach(async role=>{
      let userRole = await this.knex.table('users_roles').insert({
        user_id: user,
        role_id: role
      })
    })
    
    return user;
  }
}
