import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  ICreatePreviousMarriage,
  IPreviousMarriage,
  IUpdatePreviousMarriage
} from '../types/types'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class PreviousMarriagesModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async createPreviousMarriage(
    createPreviousMarriageData: ICreatePreviousMarriage,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      const { marriage_end_date, previous_marriage_approved, student_id } =
        createPreviousMarriageData

      const [previous_marriage_id] = await this.knex('previous_marriages')
        .insert({
          student_id,
          marriage_end_date,
          previous_marriage_approved
        })
        .returning('previous_marriage_id')

      await this.notificationsService.createNotification({
        action: 'inseriu',
        agent_name: currentUser.name,
        agentUserId: currentUser.user_id,
        newData: {
          data_fim: await this.notificationsService.formatDate(
            marriage_end_date
          )
        },
        notificationType: 4,
        objectUserId: currentUser.user_id,
        oldData: null,
        table: 'Casamentos prévios'
      })
    } catch (error) {
      console.error(error)

      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Previous marriage already exists')
      } else {
        throw new Error(error.sqlMessage)
      }
    }

    return true
  }

  async findPreviousMarriageById(
    id: number
  ): Promise<IPreviousMarriage | null> {
    let previousMarriage: IPreviousMarriage | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('previous_marriages')
          .where('previous_marriage_id', '=', id)
          .first()

        if (!result) {
          throw new Error('Previous marriage not found')
        }

        previousMarriage = {
          previous_marriage_id: result.previous_marriage_id,
          marriage_end_date: result.marriage_end_date,
          student_id: result.student_id,
          previous_marriage_approved: result.previous_marriage_approved,
          created_at: result.created_at,
          updated_at: result.updated_at
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

    return previousMarriage
  }

  async findPreviousMarriagesByStudentId(
    studentId: number
  ): Promise<IPreviousMarriage[]> {
    let previousMarriageList: IPreviousMarriage[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        previousMarriageList = await trx
          .table('previous_marriages')
          .where('student_id', '=', studentId)
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

    return previousMarriageList
  }

  async findApprovedPreviousMarriagesByStudentId(
    studentId: number
  ): Promise<IPreviousMarriage[]> {
    let previousMarriageList: IPreviousMarriage[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        previousMarriageList = await trx
          .table('previous_marriages')
          .where('student_id', '=', studentId)
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

    return previousMarriageList
  }

  async findAllPreviousMarriages(): Promise<IPreviousMarriage[]> {
    let previousMarriageList: IPreviousMarriage[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        previousMarriageList = await trx.table('previous_marriages').select('*')

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

    return previousMarriageList
  }

  async findAllNotApprovedPersonIds(): Promise<{ person_id: number }[] | null> {
    let personIds: { person_id: number }[] | null = null
    let sentError: Error | null = null

    try {
      const studentResult = await this.knex
        .table('previous_marriages')
        .join(
          'students',
          'students.student_id',
          'previous_marriages.student_id'
        )
        .select('students.person_id')
        .whereNull('previous_marriages.previous_marriage_approved')

      personIds = [...studentResult].map((row) => ({
        person_id: row.person_id
      }))
    } catch (error) {
      console.error('Erro capturado na model: ', error)
      sentError = new Error(error.message)
    }

    return personIds
  }

  async updatePreviousMarriageById(
    updatePreviousMarriage: IUpdatePreviousMarriage,
    currentUser: UserFromJwt
  ): Promise<IPreviousMarriage> {
    let updatedPreviousMarriage: IPreviousMarriage | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          previous_marriage_id,
          marriage_end_date,
          student_id,
          previous_marriage_approved
        } = updatePreviousMarriage

        let approved = await trx('previous_marriages')
          .leftJoin(
            'students',
            'students.student_id',
            'previous_marriages.student_id'
          )
          .leftJoin('people', 'people.person_id', 'students.person_id')
          .leftJoin('users', 'people.person_id', 'users.person_id')
          .first('*')
          .where('previous_marriage_id', previous_marriage_id)

        if (approved.previous_marriage_approved == true) {
          throw new Error('Registro já aprovado')
        }

        await trx('previous_marriages')
          .where('previous_marriage_id', previous_marriage_id)
          .update({
            marriage_end_date,
            student_id,
            previous_marriage_approved
          })

        await trx.commit()

        await this.notificationsService.createNotification({
          action: 'editou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: {
            data_fim: await this.notificationsService.formatDate(
              marriage_end_date
            )
          },
          notificationType: 4,
          objectUserId: approved.user_id,
          oldData: {
            data_fim: await this.notificationsService.formatDate(
              approved.marriage_end_date
            )
          },
          table: 'Casamentos prévios'
        })

        updatedPreviousMarriage = await this.findPreviousMarriageById(
          previous_marriage_id
        )
      } catch (error) {
        console.error(error)
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    return updatedPreviousMarriage!
  }

  async deletePreviousMarriageById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        let approved = await trx('previous_marriages')
          .leftJoin(
            'people',
            'people.person_id',
            'previous_marriages.student_id'
          )
          .first('*')
          .where('previous_marriage_id', id)

        if (!approved) {
          throw new Error('Previous marriage not found')
        }

        if (approved.previous_marriage_approved == true) {
          throw new Error('Registro já aprovado')
        }

        await trx('previous_marriages').where('previous_marriage_id', id).del()

        await trx.commit()
        await this.notificationsService.createNotification({
          action: 'apagou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: null,
          notificationType: 4,
          objectUserId: currentUser.user_id,
          oldData: {
            data_fim: await this.notificationsService.formatDate(
              approved.marriage_end_date
            )
          },
          table: 'Casamentos prévios'
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

    message = 'Previous marriage deleted successfully.'
    return message
  }
}
