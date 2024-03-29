import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  ICreateMaritalStatus,
  IMaritalStatus,
  IUpdateMaritalStatus
} from '../types/types'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class MaritalStatusModel {
  @InjectModel()
  private readonly knex: Knex

  constructor(private readonly notificationsService: NotificationsService) {}

  async createMaritalStatus(
    { marital_status_type_name }: ICreateMaritalStatus,
    currentUser: UserFromJwt
  ): Promise<IMaritalStatus> {
    let maritalStatus: IMaritalStatus | null = null // Definindo um valor padrão
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const [marital_status_type_id] = await trx('marital_status_types')
          .insert({
            marital_status_type_name
          })
          .returning('marital_status_type_id')

        maritalStatus = {
          marital_status_type_id,
          marital_status_type_name,
          created_at: new Date(),
          updated_at: new Date()
        }

        await trx.commit()

        await this.notificationsService.createNotification({
          notificationType: 7,
          action: 'inseriu',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: { estado_civil: marital_status_type_name },
          objectUserId: null,
          oldData: null,
          table: 'Estados civis'
        })
      } catch (error) {
        console.error(error)
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Marital status type already exists')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return maritalStatus!
  }

  async findMaritalStatusById(id: number): Promise<IMaritalStatus | null> {
    let maritalStatus: IMaritalStatus | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('marital_status_types')
          .select('*')
          .where('marital_status_type_id', '=', id)

        if (result.length < 1) {
          throw new Error('Marital status not found')
        }

        maritalStatus = {
          marital_status_type_id: result[0].marital_status_type_id,
          marital_status_type_name: result[0].marital_status_type_name,
          created_at: result[0].created_at,
          updated_at: result[0].updated_at
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

    return maritalStatus
  }

  async findAllMaritalStatus(): Promise<IMaritalStatus[]> {
    let maritalStatusList: IMaritalStatus[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx.table('marital_status_types').select('*')

        maritalStatusList = results.map((row: any) => ({
          marital_status_type_id: row.marital_status_type_id,
          marital_status_type_name: row.marital_status_type_name,
          created_at: row.created_at,
          updated_at: row.updated_at
        }))

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

    return maritalStatusList
  }

  async updateMaritalStatusById(
    updateMaritalStatus: IUpdateMaritalStatus,
    currentUser: UserFromJwt
  ): Promise<IMaritalStatus> {
    let updatedMaritalStatus: IMaritalStatus | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { marital_status_type_name } = updateMaritalStatus
        const { marital_status_type_id } = updateMaritalStatus

        const oldData = await this.findMaritalStatusById(marital_status_type_id)
        await trx('marital_status_types')
          .where('marital_status_type_id', marital_status_type_id)
          .update({
            marital_status_type_name
          })

        updatedMaritalStatus = await this.findMaritalStatusById(
          marital_status_type_id
        )

        await trx.commit()

        await this.notificationsService.createNotification({
          notificationType: 7,
          action: 'editou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: { estado_civil: marital_status_type_name },
          objectUserId: null,
          oldData: { estado_civil: oldData?.marital_status_type_name },
          table: 'Estados civis'
        })
      } catch (error) {
        console.error(error)
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    if (updatedMaritalStatus === null) {
      throw new Error('Não foi possível atualizar o marital status.')
    }

    return updatedMaritalStatus
  }

  async deleteMaritalStatusById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        const oldData = await this.findMaritalStatusById(id)
        await trx('marital_status_types')
          .where('marital_status_type_id', id)
          .del()

        await trx.commit()
        await this.notificationsService.createNotification({
          notificationType: 7,
          action: 'apagou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: null,
          objectUserId: null,
          oldData: { estado_civil: oldData?.marital_status_type_name },
          table: 'Estados civis'
        })
      } catch (error) {
        console.error(error)
        sentError = new Error(error.message)
        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    message = 'Marital status deletado com sucesso.'
    return message
  }
}
