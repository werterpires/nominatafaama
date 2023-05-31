import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  ICreateEclExperience,
  IEclExperience,
  IUpdateEclExperiences,
} from '../types/types'

@Injectable()
export class EclExperiencesModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createEclExperience(
    createEclExperienceData: ICreateEclExperience,
  ): Promise<IEclExperience> {
    let eclExperiences: IEclExperience[] | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { person_id, ecl_exp_type_id, ecl_exp_approved } =
          createEclExperienceData

        const experiences: {
          person_id: number
          ecl_exp_type_id: number
          ecl_exp_approved: boolean | null
        }[] = []

        ecl_exp_type_id.forEach((exp) => {
          experiences.push({
            ecl_exp_approved: ecl_exp_approved,
            person_id: person_id,
            ecl_exp_type_id: exp,
          })
        })

        const result = await trx('ecl_experiences')
          .insert(experiences)
          .returning('ecl_exp_id')[0].ecl_exp_id

        await trx.commit()

        eclExperiences = await this.findEclExperiencesByPersonId(person_id)
      } catch (error) {
        console.error(error)
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Eclesiastic Experience already exists')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    if (eclExperiences == null) {
      throw new Error('Experiências eclesiásticas não encontradas.')
    }
    return eclExperiences
  }

  async findEclExperienceById(id: number): Promise<IEclExperience | null> {
    let eclExperience: IEclExperience | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('ecl_experiences')
          .select('ecl_experiences.*', 'ecl_exp_types.*')
          .leftJoin(
            'ecl_exp_types',
            'ecl_experiences.ecl_exp_type_id',
            'ecl_exp_types.ecl_exp_type_id',
          )
          .where('ecl_experiences.ecl_exp_id', '=', id)

        if (result.length < 1) {
          throw new Error('Ecl Experience not found')
        }

        eclExperience = {
          ecl_exp_id: result[0].ecl_exp_id,
          person_id: result[0].person_id,
          ecl_exp_type_id: result[0].ecl_exp_type_id,
          ecl_exp_approved: result[0].ecl_exp_approved,
          created_at: result[0].created_at,
          updated_at: result[0].updated_at,
          ecl_exp_type_name: result[0].ecl_exp_type_name,
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

    return eclExperience
  }

  async findAllEclExperiences(): Promise<IEclExperience[]> {
    let eclExperiencesList: IEclExperience[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('ecl_experiences')
          .select('ecl_experiences.*', 'ecl_exp_types.*')
          .leftJoin(
            'ecl_exp_types',
            'ecl_experiences.ecl_exp_type_id',
            'ecl_exp_types.ecl_exp_type_id',
          )

        console.log(results)
        eclExperiencesList = results.map((row: any) => ({
          ecl_exp_id: row.ecl_exp_id,
          person_id: row.person_id,
          ecl_exp_type_id: row.ecl_exp_type_id,
          ecl_exp_approved: row.ecl_exp_approved,
          created_at: row.created_at,
          updated_at: row.updated_at,
          ecl_exp_type_name: row.ecl_exp_type_name,
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

    return eclExperiencesList
  }

  async findEclExperiencesByPersonId(
    personId: number,
  ): Promise<IEclExperience[]> {
    let eclExperiencesList: IEclExperience[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('ecl_experiences')
          .select('ecl_experiences.*', 'ecl_exp_types.*')
          .leftJoin(
            'ecl_exp_types',
            'ecl_experiences.ecl_exp_type_id',
            'ecl_exp_types.ecl_exp_type_id',
          )
          .where('ecl_experiences.person_id', '=', personId)

        eclExperiencesList = results.map((row: any) => ({
          ecl_exp_id: row.ecl_exp_id,
          person_id: row.person_id,
          ecl_exp_type_id: row.ecl_exp_type_id,
          ecl_exp_approved: row.ecl_exp_approved,
          created_at: row.created_at,
          updated_at: row.updated_at,
          ecl_exp_type_name: row.ecl_exp_type,
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

    return eclExperiencesList
  }

  async updateEclExperienceByPersonId(
    updateEclExperience: IUpdateEclExperiences,
  ): Promise<void> {
    let updatedEclExperience: IEclExperience | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { person_id, ecl_exp_type_ids, ecl_exp_approved } =
          updateEclExperience

        const experiences: {
          person_id: number
          ecl_exp_type_id: number
          ecl_exp_approved: boolean | null
        }[] = []

        ecl_exp_type_ids.forEach((exp) => {
          experiences.push({
            ecl_exp_approved: ecl_exp_approved,
            person_id: person_id,
            ecl_exp_type_id: exp,
          })
        })
        console.log(updateEclExperience, experiences)
        await trx('ecl_experiences').where('person_id', person_id).delete()

        if (experiences.length > 0) {
          const result = await trx('ecl_experiences')
            .insert(experiences)
            .returning('ecl_exp_id')[0].ecl_exp_id
        }

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
  }

  async updateEclExperiences(input: IUpdateEclExperiences): Promise<void> {
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { person_id, ecl_exp_type_ids } = input

        await trx('ecl_experiences')
          .where('person_id', person_id)
          .whereNotIn('ecl_exp_type_id', ecl_exp_type_ids)
          .del()

        const existingEclExpTypeIds = await trx('ecl_experiences')
          .where('person_id', person_id)
          .pluck('ecl_exp_type_id')

        const newEclExpTypeIds = ecl_exp_type_ids.filter(
          (id) => !existingEclExpTypeIds.includes(id),
        )

        const newEclExperiences = newEclExpTypeIds.map((ecl_exp_type_id) => ({
          person_id: person_id,
          ecl_exp_type_id: ecl_exp_type_id,
          ecl_exp_approved: false,
          created_at: new Date(),
          updated_at: new Date(),
        }))
        console.log(newEclExperiences)
        if (newEclExperiences.length > 0) {
          await trx('ecl_experiences')
            .insert(newEclExperiences)
            .returning('exl_exp_id')[0].exl_exp_id
        }

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
  }

  async deleteEclExperienceById(id: number): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        const existingExperience = await trx('ecl_experiences')
          .select('ecl_exp_id')
          .where('ecl_exp_id', id)
          .first()

        if (!existingExperience) {
          throw new Error('Ecl Experience not found')
        }

        await trx('ecl_experiences').where('ecl_exp_id', id).del()

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

    message = 'Ecl Experience deleted successfully.'
    return message
  }
}
