import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  ICreateEclExperience,
  IEclExperience,
  IUpdateEclExperiences
} from '../types/types'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'

@Injectable()
export class EclExperiencesModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

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
            'ecl_exp_types.ecl_exp_type_id'
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
          ecl_exp_type_name: result[0].ecl_exp_type_name
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
            'ecl_exp_types.ecl_exp_type_id'
          )
        eclExperiencesList = results.map((row: any) => ({
          ecl_exp_id: row.ecl_exp_id,
          person_id: row.person_id,
          ecl_exp_type_id: row.ecl_exp_type_id,
          ecl_exp_approved: row.ecl_exp_approved,
          created_at: row.created_at,
          updated_at: row.updated_at,
          ecl_exp_type_name: row.ecl_exp_type_name
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

  async findAllNotApprovedPersonIds(): Promise<{ person_id: number }[] | null> {
    let personIds: { person_id: number }[] | null = null
    let sentError: Error | null = null

    try {
      const studentResult = await this.knex
        .table('ecl_experiences')
        .join('users', 'users.person_id', 'ecl_experiences.person_id')
        .select('users.person_id')
        .whereNull('ecl_exp_approved')

      const spouseResult = await this.knex
        .table('ecl_experiences')
        .join('spouses', 'spouses.person_id', 'ecl_experiences.person_id')
        .join('students', 'students.student_id', 'spouses.student_id')
        .select('students.person_id')
        .whereNull('ecl_experiences.ecl_exp_approved')

      personIds = [...studentResult, ...spouseResult].map((row) => ({
        person_id: row.person_id
      }))
    } catch (error) {
      console.error('Erro capturado na model: ', error)
      sentError = new Error(error.message)
    }

    return personIds
  }

  async findEclExperiencesByPersonId(
    personId: number
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
            'ecl_exp_types.ecl_exp_type_id'
          )
          .where('ecl_experiences.person_id', '=', personId)

        eclExperiencesList = results.map((row: any) => ({
          ecl_exp_id: row.ecl_exp_id,
          person_id: row.person_id,
          ecl_exp_type_id: row.ecl_exp_type_id,
          ecl_exp_approved: row.ecl_exp_approved,
          created_at: row.created_at,
          updated_at: row.updated_at,
          ecl_exp_type_name: row.ecl_exp_type_name
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

  async findApprovedEclExperiencesByPersonId(
    personId: number
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
            'ecl_exp_types.ecl_exp_type_id'
          )
          .where('ecl_experiences.person_id', '=', personId)
          .andWhere('ecl_experiences.ecl_exp_approved', '=', true)

        eclExperiencesList = results.map((row: any) => ({
          ecl_exp_id: row.ecl_exp_id,
          person_id: row.person_id,
          ecl_exp_type_id: row.ecl_exp_type_id,
          ecl_exp_approved: row.ecl_exp_approved,
          created_at: row.created_at,
          updated_at: row.updated_at,
          ecl_exp_type_name: row.ecl_exp_type_name
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
    updateEclExperience: {
      person_id: number
      ecl_exp_type_id: number
      ecl_exp_approved: boolean | null
    }[],
    person_id,
    currentUser: UserFromJwt
  ): Promise<void> {
    let updatedEclExperience: IEclExperience | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        let oldDataExpsString: string
        const oldData = await trx('ecl_experiences')
          .leftJoin('people', 'people.person_id', 'ecl_experiences.person_id')
          .leftJoin(
            'ecl_exp_types',
            'ecl_exp_types.ecl_exp_type_id',
            'ecl_experiences.ecl_exp_type_id'
          )
          .leftJoin('users', 'users.person_id', 'people.person_id')
          .select('*')
          .where('ecl_experiences.person_id', person_id)
        if (oldData.length > 0) {
          const oldDataExps = oldData.map((row: any) => row.ecl_exp_type_name)
          oldDataExpsString = oldDataExps.join(', ')
        } else {
          oldDataExpsString = 'nenhuma experiência eclesiástica.'
        }

        await trx('ecl_experiences').where('person_id', person_id).delete()

        if (updateEclExperience.length > 0) {
          await trx('ecl_experiences').insert(updateEclExperience)
        }

        await trx.commit()
        let newDataExpsString: string
        const newData = await this.knex('ecl_experiences')
          .leftJoin('people', 'people.person_id', 'ecl_experiences.person_id')
          .leftJoin(
            'ecl_exp_types',
            'ecl_exp_types.ecl_exp_type_id',
            'ecl_experiences.ecl_exp_type_id'
          )
          .select('*')
          .where('ecl_experiences.person_id', person_id)

        if (newData.length > 0) {
          const newDataExps = newData.map((row: any) => row.ecl_exp_type_name)
          newDataExpsString = newDataExps.join(', ')
        } else {
          newDataExpsString = 'nenhuma experiência eclesiástica.'
        }

        await this.notificationsService.createNotification({
          action: 'editou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: {
            experiencias: newDataExpsString,

            pessoa: newData.length > 0 ? newData[0].name : oldData[0].name
          },
          notificationType: 4,
          objectUserId: oldData[0].user_id,
          oldData: {
            experiencias: oldDataExpsString,

            pessoa: oldData.length > 0 ? oldData[0].name : newData[0].name
          },
          table: 'Experiências eclesiásticas'
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
  }
}
