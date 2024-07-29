import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import { ICreateEndowment, IEndowment, IUpdateEndowment } from '../types/types'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class EndowmentsModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async createEndowment(
    createEndowmentData: ICreateEndowment,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      const { endowment_type_id, person_id, endowment_approved, year, place } =
        createEndowmentData

      await this.knex('endowments')
        .insert({
          endowment_type_id,
          person_id,
          endowment_approved,
          year,
          place
        })
        .returning('endowment_id')

      const personUndOthers = await this.knex('people')
        .leftJoin('endowments', 'people.person_id', 'endowments.person_id')
        .leftJoin(
          'endowment_types',
          'endowments.endowment_type_id',
          'endowment_types.endowment_type_id'
        )
        .where('people.person_id', person_id)
        .andWhere('endowment_types.endowment_type_id', endowment_type_id)
        .select('people.name', 'endowment_types.endowment_type_name')
        .first()

      await this.notificationsService.createNotification({
        action: 'inseriu',
        agent_name: currentUser.name,
        agentUserId: currentUser.user_id,
        newData: {
          investidura: personUndOthers.endowment_type_name,
          pessoa: personUndOthers?.name
        },
        notificationType: 4,
        objectUserId: currentUser.user_id,
        oldData: null,
        table: 'Investiduras'
      })
    } catch (error) {
      console.error(error)
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Endowment already exists')
      } else {
        throw new Error(error.sqlMessage)
      }
    }

    return true
  }

  async findEndowmentById(id: number): Promise<IEndowment> {
    let endowment: IEndowment | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('endowments')
          .first(
            'endowments.*',
            'endowment_types.endowment_type_name',
            'endowment_types.application'
          )
          .leftJoin(
            'endowment_types',
            'endowments.endowment_type_id',
            'endowment_types.endowment_type_id'
          )
          .where('endowment_id', '=', id)

        if (!result) {
          throw new Error('Endowment not found')
        }

        endowment = {
          endowment_id: result.endowment_id,
          endowment_type_id: result.endowment_type_id,
          person_id: result.person_id,
          endowment_approved: result.endowment_approved,
          endowment_type_name: result.endowment_type_name,
          application: result.application,
          year: result.year,
          place: result.place,
          created_at: result.created_at,
          updated_at: result.updated_at
        }

        await trx.commit()
      } catch (error) {
        sentError = new Error(error.message)
        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    if (endowment == null) {
      throw new Error('Endowment not found')
    }

    return endowment
  }

  async findAllEndowments(): Promise<IEndowment[]> {
    let endowmentsList: IEndowment[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('endowments')
          .select(
            'endowments.*',
            'endowment_types.endowment_type_name',
            'endowment_types.application'
          )
          .leftJoin(
            'endowment_types',
            'endowments.endowment_type_id',
            'endowment_types.endowment_type_id'
          )

        endowmentsList = results.map((row: any) => ({
          endowment_id: row.endowment_id,
          endowment_type_id: row.endowment_type_id,
          person_id: row.person_id,
          endowment_approved: row.endowment_approved,
          endowment_type_name: row.endowment_type_name,
          application: row.application,
          year: row.year,
          place: row.place,
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

    return endowmentsList
  }

  async findAllNotApprovedPersonIds(): Promise<{ person_id: number }[] | null> {
    let personIds: { person_id: number }[] | null = null
    let sentError: Error | null = null

    try {
      const studentResult = await this.knex
        .table('endowments')
        .join('users', 'users.person_id', 'endowments.person_id')
        .select('users.person_id')
        .whereNull('endowment_approved')

      const spouseResult = await this.knex
        .table('endowments')
        .join('spouses', 'spouses.person_id', 'endowments.person_id')
        .join('students', 'students.student_id', 'spouses.student_id')
        .select('students.person_id')
        .whereNull('endowments.endowment_approved')

      personIds = [...studentResult, ...spouseResult].map((row) => ({
        person_id: row.person_id
      }))
    } catch (error) {
      console.error('Erro capturado na model: ', error)
      sentError = new Error(error.message)
    }

    return personIds
  }

  async findEndowmentsByPersonId(personId: number): Promise<IEndowment[]> {
    let endowmentsList: IEndowment[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('endowments')
          .select(
            'endowments.*',
            'endowment_types.endowment_type_name',
            'endowment_types.application'
          )
          .leftJoin(
            'endowment_types',
            'endowments.endowment_type_id',
            'endowment_types.endowment_type_id'
          )
          .where('endowments.person_id', '=', personId)

        endowmentsList = results.map((row: any) => ({
          endowment_id: row.endowment_id,
          endowment_type_id: row.endowment_type_id,
          person_id: row.person_id,
          endowment_approved: row.endowment_approved,
          endowment_type_name: row.endowment_type_name,
          application: row.application,
          year: row.year,
          place: row.place,
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

    return endowmentsList
  }

  async findApprovedEndowmentsByPersonId(
    personId: number
  ): Promise<IEndowment[]> {
    let endowmentsList: IEndowment[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('endowments')
          .select(
            'endowments.*',
            'endowment_types.endowment_type_name',
            'endowment_types.application'
          )
          .leftJoin(
            'endowment_types',
            'endowments.endowment_type_id',
            'endowment_types.endowment_type_id'
          )
          .where('endowments.person_id', '=', personId)
          .andWhere('endowments.endowment_approved', '=', true)

        endowmentsList = results.map((row: any) => ({
          endowment_id: row.endowment_id,
          endowment_type_id: row.endowment_type_id,
          person_id: row.person_id,
          endowment_approved: row.endowment_approved,
          endowment_type_name: row.endowment_type_name,
          year: row.year,
          place: row.place,
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

    return endowmentsList
  }

  async updateEndowmentById(
    updateEndowment: IUpdateEndowment,
    currentUser: UserFromJwt
  ): Promise<number> {
    let updatedEndowment: number | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          endowment_id,
          endowment_type_id,
          person_id,
          endowment_approved,
          year,
          place
        } = updateEndowment

        let approved = await trx('endowments')
          .leftJoin(
            'endowment_types',
            'endowments.endowment_type_id',
            'endowment_types.endowment_type_id'
          )
          .leftJoin('people', 'people.person_id', 'endowments.person_id')
          .leftJoin('users', 'people.person_id', 'users.person_id')
          .first('*')
          .where('endowment_id', endowment_id)

        if (approved.endowment_approved == true) {
          throw new Error('Registro já aprovado')
        }

        updatedEndowment = await trx('endowments')
          .where('endowment_id', endowment_id)
          .update({
            endowment_type_id,
            person_id,
            endowment_approved,
            year,
            place
          })

        await trx.commit()
        const personUndOthers = await this.knex('people')
          .leftJoin('endowments', 'people.person_id', 'endowments.person_id')
          .leftJoin(
            'endowment_types',
            'endowments.endowment_type_id',
            'endowment_types.endowment_type_id'
          )
          .where('people.person_id', person_id)
          .andWhere('endowment_types.endowment_type_id', endowment_type_id)
          .select('people.name', 'endowment_types.endowment_type_name')
          .first()
        let userIdAlt
        if (!approved.user_id) {
          userIdAlt = await this.knex('spouses')
            .leftJoin('students', 'spouses.student_id', 'students.student_id')
            .leftJoin('users', 'students.person_id', 'users.person_id')
            .where('spouses.person_id', person_id)
            .first('users.user_id')
        }

        await this.notificationsService.createNotification({
          action: 'editou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: {
            investidura: personUndOthers.endowment_type_name,
            pessoa: personUndOthers?.name
          },
          notificationType: 4,
          objectUserId: approved.user_id || userIdAlt.user_id,
          oldData: {
            investidura: approved.endowment_type_name,
            pessoa: personUndOthers?.name
          },
          table: 'Investiduras'
        })
      } catch (error) {
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    if (updatedEndowment == null) {
      throw new Error('Endowment not found')
    }

    return updatedEndowment
  }

  async deleteEndowmentById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        let approved = await trx('endowments')
          .leftJoin(
            'endowment_types',
            'endowments.endowment_type_id',
            'endowment_types.endowment_type_id'
          )
          .leftJoin('people', 'people.person_id', 'endowments.person_id')
          .first('*')
          .where('endowment_id', id)

        if (!approved) {
          throw new Error('Endowment not found')
        }

        if (approved.endowment_approved == true) {
          throw new Error('Registro já aprovado')
        }

        await trx('endowments').where('endowment_id', id).del()

        await trx.commit()

        await this.notificationsService.createNotification({
          action: 'apagou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: null,
          notificationType: 4,
          objectUserId: currentUser.user_id,
          oldData: {
            investidura: approved.endowment_type_name,
            pessoa: approved?.name
          },
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

    message = 'Endowment deleted successfully'
    return message
  }
}
