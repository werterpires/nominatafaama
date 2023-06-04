import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  ICreateProfessionalExperience,
  IProfessionalExperience,
  IUpdateProfessionalExperience,
} from '../types/types'

@Injectable()
export class ProfessionalExperiencesModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createProfessionalExperience(
    createExperienceData: ICreateProfessionalExperience,
  ): Promise<IProfessionalExperience> {
    let experience: IProfessionalExperience | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          job,
          job_institution,
          job_begin_date,
          job_end_date,
          person_id,
          experience_approved,
        } = createExperienceData

        const [experience_id] = await trx('professional_experiences')
          .insert({
            job,
            job_institution,
            job_begin_date,
            job_end_date,
            person_id,
            experience_approved,
          })
          .returning('experience_id')

        await trx.commit()

        experience = await this.findProfessionalExperienceById(experience_id)
      } catch (error) {
        console.error(error)
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Professional experience already exists')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return experience!
  }

  async findProfessionalExperienceById(
    id: number,
  ): Promise<IProfessionalExperience | null> {
    let experience: IProfessionalExperience | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('professional_experiences')
          .where('experience_id', '=', id)
          .first()

        if (!result) {
          throw new Error('Professional experience not found')
        }

        experience = {
          experience_id: result.experience_id,
          job: result.job,
          job_institution: result.job_institution,
          job_begin_date: result.job_begin_date,
          job_end_date: result.job_end_date,
          person_id: result.person_id,
          experience_approved: result.experience_approved,
          created_at: result.created_at,
          updated_at: result.updated_at,
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

    return experience
  }

  async findProfessionalExperiencesByPersonId(
    personId: number,
  ): Promise<IProfessionalExperience[]> {
    let experienceList: IProfessionalExperience[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        experienceList = await trx
          .table('professional_experiences')
          .where('person_id', '=', personId)
          .select('*')

        await trx.commit()
      } catch (error) {
        console.error(error)
        sentError = new Error(error.sqlMessage)
        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    return experienceList
  }

  async findAllProfessionalExperiences(): Promise<IProfessionalExperience[]> {
    let experienceList: IProfessionalExperience[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        experienceList = await trx.table('professional_experiences').select('*')

        await trx.commit()
      } catch (error) {
        console.error(error)
        sentError = new Error(error.sqlMessage)
        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    return experienceList
  }

  async updateProfessionalExperienceById(
    updateExperience: IUpdateProfessionalExperience,
  ): Promise<IProfessionalExperience> {
    let updatedExperience: IProfessionalExperience | null = null
    let sentError: Error | null = null
    await this.knex.transaction(async (trx) => {
      try {
        const {
          experience_id,
          job,
          job_institution,
          job_begin_date,
          job_end_date,
          person_id,
          experience_approved,
        } = updateExperience

        await trx('professional_experiences')
          .where('experience_id', experience_id)
          .update({
            job,
            job_institution,
            job_begin_date,
            job_end_date,
            person_id,
            experience_approved,
          })

        await trx.commit()

        updatedExperience = await this.findProfessionalExperienceById(
          experience_id,
        )
      } catch (error) {
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    return updatedExperience!
  }

  async deleteProfessionalExperienceById(id: number): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        const existingExperience = await trx('professional_experiences')
          .select('experience_id')
          .where('experience_id', id)
          .first()

        if (!existingExperience) {
          throw new Error('Professional experience not found')
        }

        await trx('professional_experiences').where('experience_id', id).del()

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

    message = 'Professional experience deleted successfully.'
    return message
  }
}
