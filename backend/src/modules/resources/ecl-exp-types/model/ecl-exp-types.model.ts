import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  IEclExpType,
  ICreateEclExpType,
  IUpdateEclExpType,
} from '../types/types'

@Injectable()
export class EclExpTypesModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createEclExpType({
    ecl_exp_type_name,
  }: ICreateEclExpType): Promise<IEclExpType> {
    let eclExpType: IEclExpType | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const [result] = await trx('ecl_exp_types')
          .insert({
            ecl_exp_type_name,
          })
          .returning('ecl_exp_type_id')

        eclExpType = {
          ecl_exp_type_id: result,
          ecl_exp_type_name,
          created_at: new Date(),
          updated_at: new Date(),
        }

        await trx.commit()
      } catch (error) {
        console.error(error)
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('EclExpType already exists')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return eclExpType!
  }

  async findEclExpTypeById(id: number): Promise<IEclExpType | null> {
    let eclExpType: IEclExpType | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('ecl_exp_types')
          .select('*')
          .where('ecl_exp_type_id', '=', id)

        if (result.length < 1) {
          throw new Error('EclExpType not found')
        }

        eclExpType = {
          ecl_exp_type_id: result[0].ecl_exp_type_id,
          ecl_exp_type_name: result[0].ecl_exp_type_name,
          created_at: result[0].created_at,
          updated_at: result[0].updated_at,
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

    return eclExpType
  }

  async findAllEclExpTypes(): Promise<IEclExpType[]> {
    let eclExpTypesList: IEclExpType[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx.table('ecl_exp_types').select('*')

        eclExpTypesList = results.map((row: any) => ({
          ecl_exp_type_id: row.ecl_exp_type_id,
          ecl_exp_type_name: row.ecl_exp_type_name,
          created_at: row.created_at,
          updated_at: row.updated_at,
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

    return eclExpTypesList
  }

  async updateEclExpTypeById(
    updateEclExpType: IUpdateEclExpType,
  ): Promise<IEclExpType> {
    let updatedEclExpType: IEclExpType | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { ecl_exp_type_name } = updateEclExpType
        const { ecl_exp_type_id } = updateEclExpType

        await trx('ecl_exp_types')
          .where('ecl_exp_type_id', ecl_exp_type_id)
          .update({ ecl_exp_type_name })

        updatedEclExpType = await this.findEclExpTypeById(ecl_exp_type_id)

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

    if (updatedEclExpType === null) {
      throw new Error('Failed to update EclExpType.')
    }

    return updatedEclExpType
  }

  async deleteEclExpTypeById(id: number): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        await trx('ecl_exp_types').where('ecl_exp_type_id', id).del()

        await trx.commit()
      } catch (error) {
        console.error(error)
        if (error.code == 'ER_ROW_IS_REFERENCED_2') {
          sentError = new Error(
            'Alguém está usando o tipo de experiência eclesiástica que você está tentando apagar.',
          )
        } else {
          sentError = new Error(error.message)
        }

        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    message = 'EclExpType deleted successfully.'
    return message
  }
}
