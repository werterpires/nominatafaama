import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  ICreateMinistryType,
  IMinistryType,
  IUpdateMinistryType
} from '../types/types'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class MinistryTypesModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async createMinistryType(
    { ministry_type_name, ministry_type_approved }: ICreateMinistryType,
    currentUser: UserFromJwt
  ): Promise<IMinistryType> {
    let ministryType: IMinistryType | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const [ministry_type_id] = await trx('ministry_types')
          .insert({
            ministry_type_name,
            ministry_type_approved
          })
          .returning('ministry_type_id')

        ministryType = {
          ministry_type_id: ministry_type_id,
          ministry_type_name,
          ministry_type_approved,
          created_at: new Date(),
          updated_at: new Date()
        }

        await trx.commit()
        await this.notificationsService.createNotification({
          notificationType: 7,
          action: 'inseriu',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: { ministerio: ministry_type_name },
          objectUserId: null,
          oldData: null,
          table: 'Ministérios'
        })
      } catch (error) {
        console.error(error)
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Ministry type already exists')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return ministryType!
  }

  async findMinistryTypeById(id: number): Promise<IMinistryType | null> {
    let ministryType: IMinistryType | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('ministry_types')
          .select('*')
          .where('ministry_type_id', '=', id)

        if (result.length < 1) {
          throw new Error('Ministry type not found')
        }

        ministryType = {
          ministry_type_id: result[0].ministry_type_id,
          ministry_type_name: result[0].ministry_type_name,
          ministry_type_approved: result[0].ministry_type_approved,
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

    return ministryType
  }

  async findAllMinistryTypes(): Promise<IMinistryType[]> {
    let ministryTypesList: IMinistryType[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx.table('ministry_types').select('*')

        ministryTypesList = results.map((row: any) => ({
          ministry_type_id: row.ministry_type_id,
          ministry_type_name: row.ministry_type_name,
          ministry_type_approved: row.ministry_type_approved,
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

    return ministryTypesList
  }

  async updateMinistryTypeById(
    updateMinistryType: IUpdateMinistryType,
    currentUser: UserFromJwt
  ): Promise<IMinistryType> {
    let updatedMinistryType: IMinistryType | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { ministry_type_name, ministry_type_approved, ministry_type_id } =
          updateMinistryType
        const oldData = await this.findMinistryTypeById(ministry_type_id)
        await trx('ministry_types')
          .where('ministry_type_id', ministry_type_id)
          .update({ ministry_type_name, ministry_type_approved })

        updatedMinistryType = await this.findMinistryTypeById(ministry_type_id)

        await trx.commit()
        await this.notificationsService.createNotification({
          notificationType: 7,
          action: 'editou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: { ministerio: ministry_type_name },
          objectUserId: null,
          oldData: { ministerio: oldData?.ministry_type_name },
          table: 'Ministérios'
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

    if (updatedMinistryType === null) {
      throw new Error('Failed to update ministry type.')
    }

    return updatedMinistryType
  }

  async deleteMinistryTypeById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        const oldData = await this.findMinistryTypeById(id)
        await trx('ministry_types').where('ministry_type_id', id).del()

        await trx.commit()
        await this.notificationsService.createNotification({
          notificationType: 7,
          action: 'apagou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: null,
          objectUserId: null,
          oldData: { ministerio: oldData?.ministry_type_name },
          table: 'Ministérios'
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

    message = 'Ministry type deleted successfully.'
    return message
  }
}
