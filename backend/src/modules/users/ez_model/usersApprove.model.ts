import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  IAproveUser,
  IBasicUser,
  ICreateUser,
  IUpdateUser,
  IUser,
  IValidateUser
} from '../bz_types/types'
import { IRole } from 'src/shared/roles/bz_types/types'
import { ITerm } from 'src/shared/terms/types/types'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class UsersToApproveModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async findUsersToApprove(
    requiredRole: string,
    status: boolean | null
  ): Promise<IUser[]> {
    let users: IUser[] = []

    try {
      const ids = (
        await this.knex
          .table('roles')
          .join('users_roles', 'roles.role_id', 'users_roles.role_id')
          .select('user_id')
          .where('role_name', requiredRole)
      ).map((row) => row.user_id)

      const results = await this.knex
        .table('users')
        .select(
          'users.user_id',
          'users.password_hash',
          'users.principal_email',
          'users.person_id',
          'people.name',
          'people.cpf',
          'roles.role_id',
          'roles.role_name',
          'roles.role_description',
          'users.created_at',
          'users.updated_at',
          'users.user_approved'
        )
        .leftJoin('people', 'users.person_id', 'people.person_id')
        .leftJoin('users_roles', 'users.user_id', 'users_roles.user_id')
        .leftJoin('roles', 'users_roles.role_id', 'roles.role_id')
        .whereIn('users.user_id', ids)
        .andWhere('users.user_approved', status)
        .orderBy('people.name', 'asc')

      users = results.reduce((acc: IUser[], row: any) => {
        const existingUser = acc.find((u) => u.user_id === row.user_id)
        if (existingUser) {
          // Adiciona as informações de role no usuário existente
          if (row.role_id) {
            existingUser.roles.push({
              role_id: row.role_id,
              role_name: row.role_name,
              role_description: row.role_description
            })
          }
        } else {
          // Cria um novo usuário e adiciona suas informações básicas e de role
          const newUser: IUser = {
            user_id: row.user_id,
            principal_email: row.principal_email,
            person_id: row.person_id,
            name: row.name,
            cpf: row.cpf,
            roles: [],
            created_at: row.created_at,
            updated_at: row.updated_at,
            user_approved: row.user_approved
          }
          if (row.role_id) {
            newUser.roles.push({
              role_id: row.role_id,
              role_name: row.role_name,
              role_description: row.role_description
            })
          }
          acc.push(newUser)
        }
        return acc
      }, [])
    } catch (error) {
      throw error
    }

    return users
  }
}
