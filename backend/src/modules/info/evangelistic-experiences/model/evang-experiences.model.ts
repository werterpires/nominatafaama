import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  ICreateEvangelisticExperience,
  IEvangelisticExperience,
  IUpdateEvangelisticExperience,
} from '../types/types'

@Injectable()
export class EvangelisticExperiencesModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createEvangelisticExperience(
    createEvangelisticExperienceData: ICreateEvangelisticExperience,
  ): Promise<IEvangelisticExperience> {
    let evangelisticExperience: IEvangelisticExperience | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          project,
          place,
          exp_begin_date,
          exp_end_date,
          person_id,
          evang_exp_type_id,
          evang_exp_approved,
        } = createEvangelisticExperienceData

        const [result] = await trx('evangelistic_experiences').insert(
          {
            project,
            place,
            exp_begin_date,
            exp_end_date,
            person_id,
            evang_exp_type_id,
            evang_exp_approved,
          },
          '*',
          {
            includeTriggerModifications: true,
          },
        )

        evangelisticExperience = {
          evang_exp_id: result,
          project,
          place,
          exp_begin_date,
          exp_end_date,
          person_id,
          evang_exp_type_id,
          evang_exp_approved,
          created_at: new Date(),
          updated_at: new Date(),
          evang_exp_type_name: 'experiência',
        }

        await trx.commit()
      } catch (error) {
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Evangelistic Experience already exists')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return evangelisticExperience!
  }

  async findEvangelisticExperienceById(
    id: number,
  ): Promise<IEvangelisticExperience | null> {
    let evangelisticExperience: IEvangelisticExperience | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('evangelistic_experiences')
          .select('evangelistic_experiences.*', 'evang_exp_types.*')
          .leftJoin(
            'evang_exp_types',
            'evangelistic_experiences.evang_exp_type_id',
            'evang_exp_types.evang_exp_type_id',
          )
          .where('evangelistic_experiences.evang_exp_id', '=', id)

        if (result.length < 1) {
          throw new Error('Evangelistic Experience not found')
        }

        evangelisticExperience = {
          evang_exp_id: result[0].evang_exp_id,
          project: result[0].project,
          place: result[0].place,
          exp_begin_date: result[0].exp_begin_date,
          exp_end_date: result[0].exp_end_date,
          person_id: result[0].person_id,
          evang_exp_type_id: result[0].evang_exp_type_id,
          evang_exp_approved: result[0].evang_exp_approved,
          created_at: result[0].created_at,
          updated_at: result[0].updated_at,
          evang_exp_type_name: result[0].evang_exp_type_name,
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

    return evangelisticExperience
  }

  async findAllEvangelisticExperiences(): Promise<IEvangelisticExperience[]> {
    let evangelisticExperiencesList: IEvangelisticExperience[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('evangelistic_experiences')
          .select('evangelistic_experiences.*', 'evang_exp_types.*')
          .leftJoin(
            'evang_exp_types',
            'evangelistic_experiences.evang_exp_type_id',
            'evang_exp_types.evang_exp_type_id',
          )

        evangelisticExperiencesList = results.map((row: any) => ({
          evang_exp_id: row.evang_exp_id,
          person_id: row.person_id,
          evang_exp_type_id: row.evang_exp_type_id,
          evang_exp_approved: row.evang_exp_approved,
          created_at: row.created_at,
          updated_at: row.updated_at,
          project: row.project,
          place: row.place,
          exp_end_date: row.exp_end_date,
          exp_begin_date: row.exp_begin_date,
          evang_exp_type_name: row.evang_exp_type_name,
        }))

        await trx.commit()
      } catch (error) {
        sentError = new Error(error.sqlMessage)
        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    return evangelisticExperiencesList
  }

  async findEvangelisticExperiencesByPersonId(
    personId: number,
  ): Promise<IEvangelisticExperience[]> {
    let evangelisticExperiencesList: IEvangelisticExperience[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('evangelistic_experiences')
          .select('evangelistic_experiences.*', 'evang_exp_types.*')
          .leftJoin(
            'evang_exp_types',
            'evangelistic_experiences.evang_exp_type_id',
            'evang_exp_types.evang_exp_type_id',
          )
          .where('evangelistic_experiences.person_id', '=', personId)

        evangelisticExperiencesList = results.map((row: any) => ({
          evang_exp_id: row.evang_exp_id,
          project: row.project,
          place: row.place,
          exp_begin_date: row.exp_begin_date,
          exp_end_date: row.exp_end_date,
          person_id: row.person_id,
          evang_exp_type_id: row.evang_exp_type_id,
          evang_exp_approved: row.evang_exp_approved,
          created_at: row.created_at,
          updated_at: row.updated_at,
          evang_exp_type_name: row.evang_exp_type_name,
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

    return evangelisticExperiencesList
  }

  async updateEvangelisticExperienceById(
    updateEvangelisticExperience: IUpdateEvangelisticExperience,
  ): Promise<IEvangelisticExperience> {
    let updatedEvangelisticExperience: IEvangelisticExperience | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          evang_exp_id,
          project,
          place,
          exp_begin_date,
          exp_end_date,
          person_id,
          evang_exp_type_id,
        } = updateEvangelisticExperience

        await trx('evangelistic_experiences')
          .where('evang_exp_id', evang_exp_id)
          .update({
            project,
            place,
            exp_begin_date,
            exp_end_date,
            person_id,
            evang_exp_type_id,
          })

        updatedEvangelisticExperience =
          await this.findEvangelisticExperienceById(evang_exp_id)

        await trx.commit()
      } catch (error) {
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    return updatedEvangelisticExperience!
  }

  async deleteEvangelisticExperienceById(id: number): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        const existingExperience = await trx('evangelistic_experiences')
          .select('evang_exp_id')
          .where('evang_exp_id', id)
          .first()

        if (!existingExperience) {
          throw new Error('Evangelistic Experience not found')
        }

        await trx('evangelistic_experiences').where('evang_exp_id', id).del()

        await trx.commit()
      } catch (error) {
        sentError = new Error(error.message)
        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    message = 'Evangelistic Experience deleted successfully.'
    return message
  }
}
