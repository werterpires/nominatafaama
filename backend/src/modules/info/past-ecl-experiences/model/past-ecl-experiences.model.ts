import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  ICreatePastEclExp,
  IPastEclExp,
  IUpdatePastEclExp,
} from '../types/types'

@Injectable()
export class PastEclExpsModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createPastEclExp(
    createPastEclExpData: ICreatePastEclExp,
  ): Promise<IPastEclExp> {
    let pastEclExp: IPastEclExp | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          function: expFunction,
          place,
          past_exp_begin_date,
          past_exp_end_date,
          person_id,
          past_ecl_approved,
        } = createPastEclExpData

        const [result] = await trx('past_ecl_exps').insert(
          {
            function: expFunction,
            place,
            past_exp_begin_date,
            past_exp_end_date,
            person_id,
            past_ecl_approved,
          },
          '*',
          {
            includeTriggerModifications: true,
          },
        )

        await trx.commit()

        pastEclExp = await this.findPastEclExpById(result)
      } catch (error) {
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('PastEclExp already exists')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return pastEclExp!
  }

  async findPastEclExpById(id: number): Promise<IPastEclExp | null> {
    let pastEclExp: IPastEclExp | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('past_ecl_exps')
          .where('past_ecl_id', '=', id)
          .first()

        if (!result) {
          throw new Error('PastEclExp not found')
        }

        pastEclExp = {
          past_ecl_id: result.past_ecl_id,
          function: result.function,
          place: result.place,
          past_exp_begin_date: result.past_exp_begin_date,
          past_exp_end_date: result.past_exp_end_date,
          person_id: result.person_id,
          past_ecl_approved: result.past_ecl_approved,
          created_at: result.created_at,
          updated_at: result.updated_at,
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

    return pastEclExp
  }

  async findPastEclExpsByPersonId(personId: number): Promise<IPastEclExp[]> {
    let pastEclExpList: IPastEclExp[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        pastEclExpList = await trx
          .table('past_ecl_exps')
          .where('person_id', '=', personId)
          .select('*')

        await trx.commit()
      } catch (error) {
        sentError = new Error(error.sqlMessage)
        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    return pastEclExpList
  }

  async findAllPastEclExps(): Promise<IPastEclExp[]> {
    let pastEclExpList: IPastEclExp[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        pastEclExpList = await trx.table('past_ecl_exps').select('*')

        await trx.commit()
      } catch (error) {
        sentError = new Error(error.sqlMessage)
        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    return pastEclExpList
  }

  async updatePastEclExpById(
    updatePastEclExp: IUpdatePastEclExp,
  ): Promise<IPastEclExp> {
    let updatedPastEclExp: IPastEclExp | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          past_ecl_id,
          function: expFunction,
          place,
          past_exp_begin_date,
          past_exp_end_date,
          person_id,
          past_ecl_approved,
        } = updatePastEclExp

        await trx('past_ecl_exps').where('past_ecl_id', past_ecl_id).update({
          function: expFunction,
          place,
          past_exp_begin_date,
          past_exp_end_date,
          person_id,
          past_ecl_approved,
        })

        await trx.commit()

        updatedPastEclExp = await this.findPastEclExpById(past_ecl_id)
      } catch (error) {
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    return updatedPastEclExp!
  }

  async deletePastEclExpById(id: number): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        const existingPastEclExp = await trx('past_ecl_exps')
          .select('past_ecl_id')
          .where('past_ecl_id', id)
          .first()

        if (!existingPastEclExp) {
          throw new Error('PastEclExp not found')
        }

        await trx('past_ecl_exps').where('past_ecl_id', id).del()

        await trx.commit()
      } catch (error) {
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }
    message = 'PastEclExp deleted successfully.'
    return message
  }
}
