import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  IEndowmentType,
  ICreateEndowmentType,
  IUpdateEndowmentType
} from '../types/types'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class EndowmentTypesModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async createEndowmentType(
    { endowment_type_name, application }: ICreateEndowmentType,
    currentUser: UserFromJwt
  ): Promise<IEndowmentType> {
    let endowmentType: IEndowmentType | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const [endowment_type_id] = await trx('endowment_types')
          .insert({
            endowment_type_name,
            application
          })
          .returning('endowment_type_id')

        endowmentType = {
          endowment_type_id: endowment_type_id,
          endowment_type_name,
          application,
          created_at: new Date(),
          updated_at: new Date()
        }

        await trx.commit()
        await this.notificationsService.createNotification({
          notificationType: 7,
          action: 'inseriu',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: { investidura: endowment_type_name },
          objectUserId: null,
          oldData: null,
          table: 'Investiduras'
        })
      } catch (error) {
        console.error(error)
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Endowment type already exists')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return endowmentType!
  }

  async findEndowmentTypeById(id: number): Promise<IEndowmentType | null> {
    let endowmentType: IEndowmentType | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('endowment_types')
          .select('*')
          .where('endowment_type_id', '=', id)

        if (result.length < 1) {
          throw new Error('Endowment type not found')
        }

        endowmentType = {
          endowment_type_id: result[0].endowment_type_id,
          endowment_type_name: result[0].endowment_type_name,
          application: result[0].application,
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

    return endowmentType
  }

  async findAllEndowmentTypes(): Promise<IEndowmentType[]> {
    let endowmentTypesList: IEndowmentType[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx.table('endowment_types').select('*')

        endowmentTypesList = results.map((row: any) => ({
          endowment_type_id: row.endowment_type_id,
          endowment_type_name: row.endowment_type_name,
          application: row.application,
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

    return endowmentTypesList
  }

  async findEndowmentTypesByCategory(
    category: string
  ): Promise<IEndowmentType[]> {
    let endowmentTypesList: IEndowmentType[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        let applications: number[] = []

        if (category === 'student') {
          applications = [0, 1]
        } else if (category === 'spouse') {
          applications = [0, 2]
        } else {
          throw new Error('Invalid category')
        }

        const results = await trx
          .table('endowment_types')
          .select('*')
          .whereIn('application', applications)

        endowmentTypesList = results.map((row: any) => ({
          endowment_type_id: row.endowment_type_id,
          endowment_type_name: row.endowment_type_name,
          application: row.application,
          created_at: row.created_at,
          updated_at: row.updated_at
        }))

        await trx.commit()
      } catch (error) {
        console.error(error)
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    return endowmentTypesList
  }

  async updateEndowmentTypeById(
    updateEndowmentType: IUpdateEndowmentType,
    currentUser: UserFromJwt
  ): Promise<IEndowmentType> {
    let updatedEndowmentType: IEndowmentType | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { endowment_type_name, application, endowment_type_id } =
          updateEndowmentType
        const oldData = await this.findEndowmentTypeById(endowment_type_id)
        await trx('endowment_types')
          .where('endowment_type_id', endowment_type_id)
          .update({ endowment_type_name, application })
        updatedEndowmentType = await this.findEndowmentTypeById(
          endowment_type_id
        )

        await trx.commit()
        await this.notificationsService.createNotification({
          notificationType: 7,
          action: 'editou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: { investidura: endowment_type_name },
          objectUserId: null,
          oldData: { investidura: oldData?.endowment_type_name },
          table: 'Investiduras'
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

    if (updatedEndowmentType === null) {
      throw new Error('Failed to update endowment type.')
    }

    return updatedEndowmentType
  }

  async deleteEndowmentTypeById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        const oldData = await this.findEndowmentTypeById(id)
        await trx('endowment_types').where('endowment_type_id', id).del()

        await trx.commit()
        await this.notificationsService.createNotification({
          notificationType: 7,
          action: 'apagou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: null,
          objectUserId: null,
          oldData: { investidura: oldData?.endowment_type_name },
          table: 'Investiduras'
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

    message = 'Endowment type deleted successfully.'
    return message
  }
}
