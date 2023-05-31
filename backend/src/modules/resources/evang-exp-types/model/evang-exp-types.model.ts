import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  IEvangExpType,
  ICreateEvangExpType,
  IUpdateEvangExpType,
} from '../types/types'

@Injectable()
export class EvangExpTypesModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createEvangExpType({
    evang_exp_type_name,
  }: ICreateEvangExpType): Promise<IEvangExpType> {
    let evangExpType: IEvangExpType | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const [result] = await trx('evang_exp_types').insert(
          {
            evang_exp_type_name,
          },
          '*',
          {
            includeTriggerModifications: true,
          },
        )

        evangExpType = {
          evang_exp_type_id: result,
          evang_exp_type_name,
          created_at: new Date(),
          updated_at: new Date(),
        }

        await trx.commit()
      } catch (error) {
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('EvangExpType already exists')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return evangExpType!
  }

  async findEvangExpTypeById(id: number): Promise<IEvangExpType | null> {
    let evangExpType: IEvangExpType | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('evang_exp_types')
          .select('*')
          .where('evang_exp_type_id', '=', id)

        if (result.length < 1) {
          throw new Error('EvangExpType not found')
        }

        evangExpType = {
          evang_exp_type_id: result[0].evang_exp_type_id,
          evang_exp_type_name: result[0].evang_exp_type_name,
          created_at: result[0].created_at,
          updated_at: result[0].updated_at,
        }

        await trx.commit()
      } catch (error) {
        sentError = new Error(error.message)
        await trx.rollback()
        throw error
      }
    })

    if (sentError) {
      throw sentError
    }

    return evangExpType
  }

  async findAllEvangExpTypes(): Promise<IEvangExpType[]> {
    let evangExpTypesList: IEvangExpType[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx.table('evang_exp_types').select('*')

        evangExpTypesList = results.map((row: any) => ({
          evang_exp_type_id: row.evang_exp_type_id,
          evang_exp_type_name: row.evang_exp_type_name,
          created_at: row.created_at,
          updated_at: row.updated_at,
        }))

        await trx.commit()
      } catch (error) {
        await trx.rollback()
        sentError = new Error(error.sqlMessage)
      }
    })

    if (sentError) {
      throw sentError
    }

    return evangExpTypesList
  }

  async updateEvangExpTypeById(
    updateEvangExpType: IUpdateEvangExpType,
  ): Promise<IEvangExpType> {
    let updatedEvangExpType: IEvangExpType | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { evang_exp_type_name } = updateEvangExpType
        const { evang_exp_type_id } = updateEvangExpType

        await trx('evang_exp_types')
          .where('evang_exp_type_id', evang_exp_type_id)
          .update({ evang_exp_type_name })

        updatedEvangExpType = await this.findEvangExpTypeById(evang_exp_type_id)

        await trx.commit()
      } catch (error) {
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    if (updatedEvangExpType === null) {
      throw new Error('Failed to update EvangExpType.')
    }

    return updatedEvangExpType
  }

  async deleteEvangExpTypeById(id: number): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        await trx('evang_exp_types').where('evang_exp_type_id', id).del()

        await trx.commit()
      } catch (error) {
        sentError = new Error(error.message)
        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    message = 'EvangExpType deleted successfully.'
    return message
  }
}
