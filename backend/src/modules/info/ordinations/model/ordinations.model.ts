import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  ICreateOrdination,
  IOrdination,
  IUpdateOrdination
} from '../types/types'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'

@Injectable()
export class OrdinationsModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async createOrdination(
    createOrdinationData: ICreateOrdination,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      const { ordination_name, place, year, person_id, ordination_approved } =
        createOrdinationData

      const [ordination_id] = await this.knex('ordinations')
        .insert({
          ordination_name,
          place,
          year,
          person_id,
          ordination_approved
        })
        .returning('ordination_id')

      const personUndOthers = await this.knex('people')
        .where('people.person_id', person_id)
        .select('people.name')
        .first()

      await this.notificationsService.createNotification({
        action: 'inseriu',
        agent_name: currentUser.name,
        agentUserId: currentUser.user_id,
        newData: {
          ordenacao: createOrdinationData.ordination_name,
          local: createOrdinationData.place,
          ano: createOrdinationData.year,
          pessoa: personUndOthers?.name
        },
        notificationType: 4,
        objectUserId: currentUser.user_id,
        oldData: null,
        table: 'Ordenações'
      })
    } catch (error) {
      console.error(error)
      throw error
    }

    return true
  }

  async findOrdinationById(id: number): Promise<IOrdination> {
    let ordination: IOrdination | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx('ordinations')
          .first('ordinations.*')
          .where('ordinations.ordination_id', '=', id)
        if (!result) {
          throw new Error('Ordination not found')
        }

        ordination = {
          ordination_id: result.ordination_id,
          ordination_name: result.ordination_name,
          place: result.place,
          year: result.year,
          person_id: result.person_id,
          ordination_approved: result.ordination_approved,
          created_at: result.created_at,
          updated_at: result.updated_at
        }

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

    if (ordination == null) {
      throw new Error('Ordination not found')
    }

    return ordination
  }

  async findAllOrdinations(): Promise<IOrdination[]> {
    let ordinationsList: IOrdination[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx('ordinations').select('ordinations.*')

        ordinationsList = results.map((row: any) => ({
          ordination_id: row.ordination_id,
          ordination_name: row.ordination_name,
          place: row.place,
          year: row.year,
          person_id: row.person_id,
          personName: row.person_name,
          ordination_approved: row.ordination_approved,
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

    return ordinationsList
  }

  async findAllNotApprovedPersonIds(): Promise<{ person_id: number }[] | null> {
    let personIds: { person_id: number }[] | null = null
    let sentError: Error | null = null

    try {
      const studentResult = await this.knex
        .table('ordinations')
        .join('users', 'users.person_id', 'ordinations.person_id')
        .select('users.person_id')
        .whereNull('ordination_approved')

      const spouseResult = await this.knex
        .table('ordinations')
        .join('spouses', 'spouses.person_id', 'ordinations.person_id')
        .join('students', 'students.student_id', 'spouses.student_id')
        .select('students.person_id')
        .whereNull('ordinations.ordination_approved')

      personIds = [...studentResult, ...spouseResult].map((row) => ({
        person_id: row.person_id
      }))
    } catch (error) {
      console.error('Erro capturado na model: ', error)
      sentError = new Error(error.message)
    }

    return personIds
  }

  async findOrdinationsByPersonId(person_id: number): Promise<IOrdination[]> {
    let ordinationsList: IOrdination[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx('ordinations')
          .select('ordinations.*')
          .where('ordinations.person_id', '=', person_id)

        ordinationsList = results.map((row: any) => ({
          ordination_id: row.ordination_id,
          ordination_name: row.ordination_name,
          place: row.place,
          year: row.year,
          person_id: row.person_id,
          personName: row.person_name,
          ordination_approved: row.ordination_approved,
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

    return ordinationsList
  }

  async findApprovedOrdinationsByPersonId(
    person_id: number
  ): Promise<IOrdination[]> {
    let ordinationsList: IOrdination[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx('ordinations')
          .select('ordinations.*')
          .where('ordinations.person_id', '=', person_id)
          .andWhere('ordinations.ordination_approved', '=', true)

        results.sort((a, b) => {
          if (!a.year && !b.year) return 0
          if (!a.year) return 1
          if (!b.year) return -1
          return new Date(a.year).getTime() - new Date(b.year).getTime()
        })

        ordinationsList = results.map((row: any) => ({
          ordination_id: row.ordination_id,
          ordination_name: row.ordination_name,
          place: row.place,
          year: row.year,
          person_id: row.person_id,
          personName: row.person_name,
          ordination_approved: row.ordination_approved,
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

    return ordinationsList
  }

  async updateOrdinationById(
    updateOrdination: IUpdateOrdination,
    currentUser: UserFromJwt
  ): Promise<number> {
    let updatedOrdination: number | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          ordination_id,
          ordination_name,
          place,
          year,
          person_id,
          ordination_approved
        } = updateOrdination

        let approved = await trx('ordinations')
          .leftJoin('people', 'people.person_id', 'ordinations.person_id')
          .leftJoin('users', 'users.person_id', 'ordinations.person_id')
          .first('*')
          .where('ordination_id', ordination_id)

        if (approved.ordination_approved == true) {
          throw new Error('Registro já aprovado')
        }

        updatedOrdination = await trx('ordinations')
          .where('ordination_id', ordination_id)
          .update({
            ordination_name,
            place,
            year,
            person_id,
            ordination_approved
          })

        await trx.commit()

        const personUndOthers = await this.knex('people')
          .where('people.person_id', person_id)
          .select('people.name')
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
            ordenacao: ordination_name,
            local: place,
            ano: year,
            pessoa: personUndOthers?.name
          },
          notificationType: 4,
          objectUserId: approved.user_id || userIdAlt.user_id,
          oldData: {
            ordenacao: approved.ordination_name,
            local: approved.place,
            ano: approved.year,
            pessoa: personUndOthers?.name
          },
          table: 'Ordenações'
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

    if (updatedOrdination == null) {
      updatedOrdination = 0
    }

    return updatedOrdination
  }

  async deleteOrdinationById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        let approved = await trx('ordinations')
          .leftJoin('people', 'people.person_id', 'ordinations.person_id')
          .first('*')
          .where('ordination_id', id)

        if (!approved) {
          throw new Error('Ordination not found')
        }

        if (approved.ordination_approved == true) {
          throw new Error('Registro já aprovado')
        }
        await trx('ordinations').where('ordination_id', id).del()

        await trx.commit()
        await this.notificationsService.createNotification({
          action: 'apagou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: null,
          notificationType: 4,
          objectUserId: currentUser.user_id,
          oldData: {
            ordenacao: approved.ordination_name,
            local: approved.place,
            ano: approved.year,
            pessoa: approved.name
          },
          table: 'Ordenações'
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

    message = 'Ordination deleted successfully'
    return message
  }
}
