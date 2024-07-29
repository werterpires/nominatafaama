import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  ICreateEvangelisticExperience,
  IEvangelisticExperience,
  IUpdateEvangelisticExperience
} from '../types/types'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class EvangelisticExperiencesModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async createEvangelisticExperience(
    createEvangelisticExperienceData: ICreateEvangelisticExperience,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      const {
        project,
        place,
        exp_begin_date,
        exp_end_date,
        person_id,
        evang_exp_type_id,
        evang_exp_approved
      } = createEvangelisticExperienceData

      await this.knex('evangelistic_experiences')
        .insert({
          project,
          place,
          exp_begin_date,
          exp_end_date,
          person_id,
          evang_exp_type_id,
          evang_exp_approved
        })
        .returning('evang_exp_id')

      const personUndOthers = await this.knex('people')
        .leftJoin(
          'evangelistic_experiences',
          'people.person_id',
          'evangelistic_experiences.person_id'
        )
        .leftJoin(
          'evang_exp_types',
          'evangelistic_experiences.evang_exp_type_id',
          'evang_exp_types.evang_exp_type_id'
        )
        .where('people.person_id', person_id)
        .andWhere('evang_exp_types.evang_exp_type_id', evang_exp_type_id)
        .select('people.name', 'evang_exp_types.evang_exp_type_name')
        .first()

      await this.notificationsService.createNotification({
        action: 'inseriu',
        agent_name: currentUser.name,
        agentUserId: currentUser.user_id,
        newData: {
          tipo: personUndOthers?.evang_exp_type_name,
          projeto: createEvangelisticExperienceData.project,
          local: createEvangelisticExperienceData.place,
          data_inicio: await this.notificationsService.formatDate(
            createEvangelisticExperienceData.exp_begin_date
          ),
          data_conclusao: await this.notificationsService.formatDate(
            createEvangelisticExperienceData.exp_end_date
          ),
          pessoa: personUndOthers?.name
        },
        notificationType: 4,
        objectUserId: currentUser.user_id,
        oldData: null,
        table: 'Experiências evangelísticas'
      })

      return true
    } catch (error) {
      console.error(error)
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Evangelistic Experience already exists')
      } else {
        throw new Error(error.sqlMessage)
      }
    }
  }

  async findEvangelisticExperienceById(
    id: number
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
            'evang_exp_types.evang_exp_type_id'
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
          evang_exp_type_name: result[0].evang_exp_type_name
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
            'evang_exp_types.evang_exp_type_id'
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
          evang_exp_type_name: row.evang_exp_type_name
        }))

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

    return evangelisticExperiencesList
  }

  async findAllNotApprovedPersonIds(): Promise<{ person_id: number }[] | null> {
    let personIds: { person_id: number }[] | null = null
    let sentError: Error | null = null

    try {
      const studentResult = await this.knex
        .table('evangelistic_experiences')
        .join('users', 'users.person_id', 'evangelistic_experiences.person_id')
        .select('users.person_id')
        .whereNull('evang_exp_approved')

      const spouseResult = await this.knex
        .table('evangelistic_experiences')
        .join(
          'spouses',
          'spouses.person_id',
          'evangelistic_experiences.person_id'
        )
        .join('students', 'students.student_id', 'spouses.student_id')
        .select('students.person_id')
        .whereNull('evangelistic_experiences.evang_exp_approved')

      personIds = [...studentResult, ...spouseResult].map((row) => ({
        person_id: row.person_id
      }))
    } catch (error) {
      console.error('Erro capturado na model: ', error)
      sentError = new Error(error.message)
    }

    return personIds
  }

  async findEvangelisticExperiencesByPersonId(
    personId: number
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
            'evang_exp_types.evang_exp_type_id'
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
          evang_exp_type_name: row.evang_exp_type_name
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

    return evangelisticExperiencesList
  }

  async findApprovedEvangelisticExperiencesByPersonId(
    personId: number
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
            'evang_exp_types.evang_exp_type_id'
          )
          .where('evangelistic_experiences.person_id', '=', personId)
          .andWhere('evang_exp_approved', '=', true)

        results.sort((a, b) => {
          if (!a.exp_end_date && !b.exp_end_date) return 0
          if (!a.exp_end_date) return 1
          if (!b.exp_end_date) return -1
          return (
            new Date(a.exp_end_date).getTime() -
            new Date(b.exp_end_date).getTime()
          )
        })

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
          evang_exp_type_name: row.evang_exp_type_name
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

    return evangelisticExperiencesList
  }

  async updateEvangelisticExperienceById(
    updateEvangelisticExperience: IUpdateEvangelisticExperience,
    currentUser: UserFromJwt
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
          evang_exp_type_id,
          evang_exp_approved
        } = updateEvangelisticExperience

        let approved = await trx('evangelistic_experiences')
          .leftJoin(
            'evang_exp_types',
            'evangelistic_experiences.evang_exp_type_id',
            'evang_exp_types.evang_exp_type_id'
          )
          .leftJoin(
            'people',
            'evangelistic_experiences.person_id',
            'people.person_id'
          )
          .leftJoin('users', 'people.person_id', 'users.person_id')
          .first('*')
          .where('evang_exp_id', evang_exp_id)

        if (approved.evang_exp_approved == true) {
          throw new Error('Registro já aprovado')
        }

        await trx('evangelistic_experiences')
          .where('evang_exp_id', evang_exp_id)
          .update({
            project,
            place,
            exp_begin_date,
            exp_end_date,
            evang_exp_type_id,
            evang_exp_approved
          })

        updatedEvangelisticExperience =
          await this.findEvangelisticExperienceById(evang_exp_id)

        await trx.commit()

        const personUndOthers = await this.knex('people')
          .leftJoin(
            'evangelistic_experiences',
            'people.person_id',
            'evangelistic_experiences.person_id'
          )
          .leftJoin(
            'evang_exp_types',
            'evangelistic_experiences.evang_exp_type_id',
            'evang_exp_types.evang_exp_type_id'
          )
          .where('people.person_id', approved.person_id)
          .andWhere('evang_exp_types.evang_exp_type_id', evang_exp_type_id)
          .select('people.name', 'evang_exp_types.evang_exp_type_name')
          .first()

        let userIdAlt
        if (!approved.user_id) {
          userIdAlt = await this.knex('spouses')
            .leftJoin('students', 'spouses.student_id', 'students.student_id')
            .leftJoin('users', 'students.person_id', 'users.person_id')
            .where('spouses.person_id', approved.person_id)
            .first('users.user_id')
        }

        await this.notificationsService.createNotification({
          action: 'editou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: {
            tipo: personUndOthers?.evang_exp_type_name,
            projeto: project,
            local: place,
            data_inicio: await this.notificationsService.formatDate(
              exp_begin_date
            ),
            data_conclusao: await this.notificationsService.formatDate(
              exp_end_date
            ),
            pessoa: personUndOthers?.name
          },
          notificationType: 4,
          objectUserId: approved.user_id || userIdAlt.user_id,
          oldData: {
            tipo: approved?.evang_exp_type_name,
            projeto: approved.project,
            local: approved.place,
            data_inicio: await this.notificationsService.formatDate(
              approved.exp_begin_date
            ),
            data_conclusao: await this.notificationsService.formatDate(
              approved.exp_end_date
            ),
            pessoa: personUndOthers?.name
          },
          table: 'Experiências evangelísticas'
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

    return updatedEvangelisticExperience!
  }

  async deleteEvangelisticExperienceById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        let approved = await trx('evangelistic_experiences')
          .leftJoin(
            'evang_exp_types',
            'evangelistic_experiences.evang_exp_type_id',
            'evang_exp_types.evang_exp_type_id'
          )
          .leftJoin(
            'people',
            'evangelistic_experiences.person_id',
            'people.person_id'
          )
          .first('*')
          .where('evang_exp_id', id)

        if (!approved) {
          throw new Error('Evangelistic Experience not found')
        }

        if (approved.evang_exp_approved == true) {
          throw new Error('Registro já aprovado')
        }

        await trx('evangelistic_experiences').where('evang_exp_id', id).del()

        await trx.commit()

        await this.notificationsService.createNotification({
          action: 'apagou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: null,
          notificationType: 4,
          objectUserId: currentUser.user_id,
          oldData: {
            tipo: approved.evang_exp_type_name,
            projeto: approved.project,
            local: approved.place,
            data_inicio: await this.notificationsService.formatDate(
              approved.exp_begin_date
            ),
            data_conclusao: await this.notificationsService.formatDate(
              approved.exp_end_date
            ),
            pessoa: approved?.name
          },
          table: 'Experiências evangelísticas'
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

    message = 'Evangelistic Experience deleted successfully.'
    return message
  }
}
