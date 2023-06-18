import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  IAproveUser,
  IBasicUser,
  ICreateUser,
  IUpdateUser,
  IUser,
  IValidateUser,
} from '../bz_types/types'
import { IRole } from 'src/shared/roles/bz_types/types'

@Injectable()
export class UsersModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createUser({
    name,
    cpf,
    password_hash,
    principal_email,
    role_id,
  }: ICreateUser): Promise<IUser> {
    let user: IUser | null = {} as IUser
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const [person_id] = await trx('people')
          .insert({ name, cpf })
          .returning('person_id')
        const [user_id] = await trx('users')
          .insert({
            password_hash,
            principal_email,
            person_id: person_id,
            user_approved: null,
          })
          .returning('user_id')

        const roles = role_id.map((role) => ({
          user_id: user_id,
          role_id: role,
        }))

        await trx('users_roles').insert(roles)

        await trx.commit()
      } catch (error) {
        console.error(error)
        await trx.rollback()
        if (error.code == 'ER_DUP_ENTRY') {
          sentError = new Error('CPF ou Email já cadastrado')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return user
  }

  async findUserById(id: number): Promise<IUser> {
    let user: IUser | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('users')
          .select(
            'users.user_id',
            'users.principal_email',
            'users.person_id',
            'people.name',
            'people.cpf',
            'roles.role_id',
            'roles.role_name',
            'roles.role_description',
          )
          .leftJoin('people', 'users.person_id', 'people.person_id')
          .leftJoin('users_roles', 'users.user_id', 'users_roles.user_id')
          .leftJoin('roles', 'users_roles.role_id', 'roles.role_id')
          .where('users.user_id', '=', id)

        if (result.length < 1) {
          throw new Error(`Usuário não encontrado`)
        }

        if (result) {
          // Transforma o resultado em um objeto IUser
          const roleMap = new Map<number, IRole>()
          const roles: IRole[] = []

          result.forEach((row: any) => {
            const roleId = row.role_id

            if (roleId) {
              if (!roleMap.has(roleId)) {
                roleMap.set(roleId, {
                  role_id: roleId,
                  role_name: row.role_name,
                  role_description: row.role_description,
                })
              }
              roles.push(roleMap.get(roleId)!)
            }
          })

          user = {
            user_id: result[0].user_id,
            principal_email: result[0].principal_email,
            person_id: result[0].person_id,
            name: result[0].name,
            cpf: result[0].cpf,
            roles,
            created_at: result[0].created_at,
            updated_at: result[0].updated_at,
          }
        }

        await trx.commit()
      } catch (error) {
        console.error(error)
        sentError = new Error(error.message)
        await trx.rollback()
        throw error
      }
    })

    if (sentError) {
      throw sentError
    }

    if (user == null) {
      throw new Error('user not found')
    }
    return user
  }

  async findUsersByIds(ids: number[]): Promise<IUser[] | null> {
    let users: IUser[] | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('users')
          .select(
            'users.user_id',
            'users.principal_email',
            'users.person_id',
            'people.name',
            'people.cpf',
            'roles.role_id',
            'roles.role_name',
            'roles.role_description',
          )
          .leftJoin('people', 'users.person_id', 'people.person_id')
          .leftJoin('users_roles', 'users.user_id', 'users_roles.user_id')
          .leftJoin('roles', 'users_roles.role_id', 'roles.role_id')
          .whereIn('users.person_id', ids)

        const userMap = new Map<number, IUser>()

        results.forEach((row: any) => {
          const userId = row.user_id

          if (!userMap.has(userId)) {
            const user: IUser = {
              user_id: row.user_id,
              principal_email: row.principal_email,
              person_id: row.person_id,
              name: row.name,
              cpf: row.cpf,
              roles: [],
              created_at: row.created_at,
              updated_at: row.updated_at,
            }
            userMap.set(userId, user)
          }

          const role: IRole = {
            role_id: row.role_id,
            role_name: row.role_name,
            role_description: row.role_description,
          }
          userMap.get(userId)!.roles.push(role)
        })

        users = Array.from(userMap.values())

        await trx.commit()
      } catch (error) {
        console.error(error)
        sentError = new Error(error.message)
        await trx.rollback()
        throw error
      }
    })

    if (sentError) {
      throw sentError
    }

    return users
  }

  async searchUsersByName(searchString: string): Promise<IUser[] | null> {
    let users: IUser[] | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('users')
          .select(
            'users.user_id',
            'users.principal_email',
            'users.person_id',
            'people.name',
            'people.cpf',
            'roles.role_id',
            'roles.role_name',
            'roles.role_description',
          )
          .leftJoin('people', 'users.person_id', 'people.person_id')
          .leftJoin('users_roles', 'users.user_id', 'users_roles.user_id')
          .leftJoin('roles', 'users_roles.role_id', 'roles.role_id')
          .leftJoin('students', 'people.person_id', 'students.person_id')
          .whereRaw('LOWER(people.name) LIKE ?', [`%${searchString.toLowerCase()}%`])
          .where('students.person_id', '=', trx.raw('people.person_id'));

          users = results.reduce((acc: IUser[], row: any) => {
            const existingUser = acc.find((u) => u.user_id === row.user_id)
  
            if (existingUser) {
              if (row.role_id) {
                existingUser.roles.push({
                  role_id: row.role_id,
                  role_name: row.role_name,
                  role_description: row.role_description,
                })
              }
            } else {
              const newUser: IUser = {
                user_id: row.user_id,
                principal_email: row.principal_email,
                person_id: row.person_id,
                name: row.name,
                cpf: row.cpf,
                roles: [],
                created_at: row.created_at,
                updated_at: row.updated_at,
                user_approved: row.user_approved,
              }
  
              if (row.role_id) {
                newUser.roles.push({
                  role_id: row.role_id,
                  role_name: row.role_name,
                  role_description: row.role_description,
                })
              }
  
              acc.push(newUser)
            }
  
            return acc
          }, [])

        await trx.commit()
      } catch (error) {
        console.error(error)
        sentError = new Error(error.message)
        await trx.rollback()
        throw error
      }
    })

    if (sentError) {
      throw sentError
    }

    return users
  }

  async findUserByEmail(email: string): Promise<IValidateUser | null> {
    let user: IValidateUser | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('users')
          .select(
            'users.user_id',
            'users.principal_email',
            'users.person_id',
            'users.password_hash',
            'people.name',
            'people.cpf',
            'roles.role_id',
            'roles.role_name',
            'roles.role_description',
            'users.user_approved',
          )
          .leftJoin('people', 'users.person_id', 'people.person_id')
          .leftJoin('users_roles', 'users.user_id', 'users_roles.user_id')
          .leftJoin('roles', 'users_roles.role_id', 'roles.role_id')
          .where('users.principal_email', '=', email)

        if (result) {
          // Transforma o resultado em um objeto IUser
          const roleMap = new Map<number, IRole>()
          const roles: IRole[] = []

          result.forEach((row: any) => {
            const roleId = row.role_id

            if (roleId) {
              if (!roleMap.has(roleId)) {
                roleMap.set(roleId, {
                  role_id: roleId,
                  role_name: row.role_name,
                  role_description: row.role_description,
                })
              }
              roles.push(roleMap.get(roleId)!)
            }
          })

          user = {
            user_id: result[0].user_id,
            principal_email: result[0].principal_email,
            password_hash: result[0].password_hash,
            person_id: result[0].person_id,
            name: result[0].name,
            cpf: result[0].cpf,
            roles,
            created_at: result[0].created_at,
            updated_at: result[0].updated_at,
            user_approved: result[0].user_approved,
          }
        }

        await trx.commit()
      } catch (error) {
        console.error(error)
        await trx.rollback()
        throw error
      }
    })

    if (user === null) {
      throw new Error(`User with email ${email} not found.`)
    }
    return user
  }

  async findAllUsers(): Promise<IUser[]> {
    let users: IUser[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
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
            'users.user_approved',
          )
          .leftJoin('people', 'users.person_id', 'people.person_id')
          .leftJoin('users_roles', 'users.user_id', 'users_roles.user_id')
          .leftJoin('roles', 'users_roles.role_id', 'roles.role_id')

        users = results.reduce((acc: IUser[], row: any) => {
          const existingUser = acc.find((u) => u.user_id === row.user_id)

          if (existingUser) {
            // Adiciona as informações de role no usuário existente
            if (row.role_id) {
              existingUser.roles.push({
                role_id: row.role_id,
                role_name: row.role_name,
                role_description: row.role_description,
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
              user_approved: row.user_approved,
            }

            if (row.role_id) {
              newUser.roles.push({
                role_id: row.role_id,
                role_name: row.role_name,
                role_description: row.role_description,
              })
            }

            acc.push(newUser)
          }

          return acc
        }, [])

        await trx.commit()
      } catch (error) {
        console.error(error)
        await trx.rollback()
        sentError = new Error(error.sqlMessage)
      }
    })

    if (sentError) {
      throw sentError
    }

    return users
  }

  async aproveUserById({
    user_id,
    user_approved,
  }: IAproveUser): Promise<IAproveUser> {
    let sentError: Error | null = null
    let user: IAproveUser | null = null
    const result = await this.knex.transaction(async (trx) => {
      try {
        // Atualiza a coluna user_approved na tabela users
        const updateResult = await trx
          .table('users')
          .where({ user_id })
          .update({ user_approved }, [
            'user_id',
            'principal_email',
            'password_hash',
          ])

        if (!updateResult) {
          throw new Error(`User with id ${user_id} not found`)
        }

        // Realiza a consulta do usuário atualizado
        const [result] = await trx
          .table('users')
          .select('user_id', 'user_approved')
          .where('user_id', '=', user_id)

        user = {
          user_id: result.user_id,
          user_approved: result.user_approved,
        }

        await trx.commit()
        return user
      } catch (error) {
        console.error(error)
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }
    if (user === null) {
      throw new Error(`Usuário com id: ${{ user_id }} não foi encontrado.`)
    }
    return user
  }

  async updateUserById(id: number, updateUser: IUpdateUser): Promise<IUser> {
    let updatedUser: IUser | null = null
    let sentError: Error | null = null

    const result = await this.knex.transaction(async (trx) => {
      try {
        if (updateUser.password_hash) {
          await this.knex('users')
            .where('user_id', id)
            .update({ password_hash: updateUser.password_hash })
        }

        if (updateUser.principal_email) {
          await this.knex('users')
            .where('user_id', id)
            .update({ principal_email: updateUser.principal_email })
        }

        if (updateUser.name || updateUser.cpf) {
          const [userPeople] = await trx
            .table('users')
            .select('person_id')
            .where('user_id', id)

          if (updateUser.name) {
            await this.knex('people')
              .where('person_id', userPeople.person_id)
              .update({ name: updateUser.name })
          }

          if (updateUser.cpf) {
            await this.knex('people')
              .where('person_id', userPeople.person_id)
              .update({ cpf: updateUser.cpf })
          }
        }

        if (
          updateUser.roles_id !== undefined &&
          updateUser.roles_id.length > 0
        ) {
          await this.knex.transaction(async (trx) => {
            if (updateUser.roles_id !== undefined) {
              await trx('users_roles').del().where('user_id', id)
              const roles = updateUser.roles_id.map((role_id) => ({
                user_id: id,
                role_id,
              }))
              await trx('users_roles').insert(roles)
            }
          })
        }

        updatedUser = await this.findUserById(id)
      } catch (error) {
        console.error(error)
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    if (updatedUser === null) {
      throw new Error('Não foi possível atualizar o usuário.')
    }

    return updatedUser
  }

  async findPasswordById(id: number): Promise<string | null> {
    let password: string | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('users')
          .select('password_hash')
          .where('users.user_id', '=', id)

        if (result.length < 1) {
          throw new Error(`Usuário não encontrado`)
        }

        if (result) {
          password = result[0].password_hash
        }

        await trx.commit()
      } catch (error) {
        console.error(error)
        sentError = new Error(error.message)
        await trx.rollback()
      }
    })

    if (password === null) {
      sentError = new Error('Usuário não encontrado.')
    }
    if (sentError) {
      throw sentError
    }

    return password
  }

  async deleteUserById(id: number): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        // Recupera a pessoa do usuário
        const [userPeople] = await trx
          .table('users')
          .join('people', 'people.person_id', '=', 'users.person_id')
          .select('people.person_id')
          .where('users.user_id', '=', id)

        // Remove as roles do usuário
        await trx('users_roles').where('user_id', id).del()

        // Remove o usuário
        await trx('users').where('user_id', id).del()

        // Tenta remover a pessoa, mas não interrompe a transação se não for possível
        try {
          await trx('people').where('person_id', userPeople.person_id).del()
        } catch (error) {
          console.error(error)
          message =
            'Não foi possível deletar o nome e o cpf associados ao usuário. Provavelmente Essa pessoa possui ligação com algum estudante.'
        }

        await trx.commit()
      } catch (error) {
        console.error(error)
        sentError = new Error(error.message)
        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    message = 'Usuário deletado com sucesso. ' + message
    return message
  }
}
