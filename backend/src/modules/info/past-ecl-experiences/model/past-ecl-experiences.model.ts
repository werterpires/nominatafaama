import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  ICreatePastEclExp,
  IPastEclExp,
  IUpdatePastEclExp
} from '../types/types'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class PastEclExpsModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async createPastEclExp(
    createPastEclExpData: ICreatePastEclExp,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      const {
        function: expFunction,
        place,
        past_exp_begin_date,
        past_exp_end_date,
        person_id,
        past_ecl_approved
      } = createPastEclExpData

      await this.knex.transaction(async (trx) => {
        await trx('past_ecl_exps')
          .insert({
            function: expFunction,
            place,
            past_exp_begin_date,
            past_exp_end_date,
            person_id,
            past_ecl_approved
          })
          .returning('past_ecl_id')

        await trx.commit()
      })

      const personUndOthers = await this.knex('people')
        .where('people.person_id', person_id)
        .select('people.name')
        .first()

      await this.notificationsService.createNotification({
        action: 'inseriu',
        agent_name: currentUser.name,
        agentUserId: currentUser.user_id,
        newData: {
          funcao: expFunction,
          local: place,
          data_inicio: await this.notificationsService.formatDate(
            past_exp_begin_date
          ),
          data_conclusao: await this.notificationsService.formatDate(
            past_exp_end_date
          ),
          pessoa: personUndOthers?.name
        },
        notificationType: 4,
        objectUserId: currentUser.user_id,
        oldData: null,
        table: 'Experiências eclesiásticas anteriores'
      })
    } catch (error) {
      console.error(error)

      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('PastEclExp already exists')
      } else {
        throw new Error(error.sqlMessage)
      }
    }

    return true
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
        console.error(error)
        sentError = new Error(error.sqlMessage)
        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    return pastEclExpList
  }

  async findApprovedPastEclExpsByPersonId(
    personId: number
  ): Promise<IPastEclExp[]> {
    let pastEclExpList: IPastEclExp[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        pastEclExpList = await trx
          .table('past_ecl_exps')
          .where('person_id', '=', personId)
          .andWhere('past_ecl_approved', '=', true)
          .select('*')

        pastEclExpList.sort((a, b) => {
          if (!a.past_exp_end_date && !b.past_exp_end_date) return 0
          if (!a.past_exp_end_date) return 1
          if (!b.past_exp_end_date) return -1
          return (
            new Date(a.past_exp_end_date).getTime() -
            new Date(b.past_exp_end_date).getTime()
          )
        })

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
        console.error(error)
        sentError = new Error(error.sqlMessage)
        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    return pastEclExpList
  }

  async findAllNotApprovedPersonIds(): Promise<{ person_id: number }[] | null> {
    let personIds: { person_id: number }[] | null = null
    let sentError: Error | null = null

    try {
      const studentResult = await this.knex
        .table('past_ecl_exps')
        .join('users', 'users.person_id', 'past_ecl_exps.person_id')
        .select('users.person_id')
        .whereNull('past_ecl_approved')

      const spouseResult = await this.knex
        .table('past_ecl_exps')
        .join('spouses', 'spouses.person_id', 'past_ecl_exps.person_id')
        .join('students', 'students.student_id', 'spouses.student_id')
        .select('students.person_id')
        .whereNull('past_ecl_exps.past_ecl_approved')

      personIds = [...studentResult, ...spouseResult].map((row) => ({
        person_id: row.person_id
      }))
    } catch (error) {
      console.error('Erro capturado na model: ', error)
      sentError = new Error(error.message)
    }

    return personIds
  }

  async updatePastEclExpById(
    updatePastEclExp: IUpdatePastEclExp,
    currentUser: UserFromJwt
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
          past_ecl_approved
        } = updatePastEclExp

        let approved = await trx('past_ecl_exps')
          .first('*')
          .leftJoin('people', 'people.person_id', 'past_ecl_exps.person_id')
          .leftJoin('users', 'users.person_id', 'people.person_id')
          .where('past_ecl_id', past_ecl_id)

        if (approved.past_ecl_approved == true) {
          throw new Error('Registro já aprovado')
        }

        await trx('past_ecl_exps').where('past_ecl_id', past_ecl_id).update({
          function: expFunction,
          place,
          past_exp_begin_date,
          past_exp_end_date,
          person_id,
          past_ecl_approved
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
            funcao: expFunction,
            local: place,
            data_inicio: await this.notificationsService.formatDate(
              past_exp_begin_date
            ),
            data_conclusao: await this.notificationsService.formatDate(
              past_exp_end_date
            ),
            pessoa: personUndOthers?.name
          },
          notificationType: 4,
          objectUserId: approved.user_id || userIdAlt.user_id,
          oldData: {
            funcao: approved.function,
            local: approved.place,
            data_inicio: await this.notificationsService.formatDate(
              approved.past_exp_begin_date
            ),
            data_conclusao: await this.notificationsService.formatDate(
              approved.past_exp_end_date
            ),
            pessoa: personUndOthers?.name
          },
          table: 'Experiências eclesiásticas anteriores'
        })

        updatedPastEclExp = await this.findPastEclExpById(past_ecl_id)
      } catch (error) {
        console.error(error)
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    return updatedPastEclExp!
  }

  async deletePastEclExpById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        let approved = await trx('past_ecl_exps')
          .first('*')
          .leftJoin('people', 'people.person_id', 'past_ecl_exps.person_id')
          .where('past_ecl_id', id)

        if (!approved) {
          throw new Error('PastEclExp not found')
        }

        if (approved.past_ecl_approved == true) {
          throw new Error('Registro já aprovado')
        }

        await trx('past_ecl_exps').where('past_ecl_id', id).del()

        await trx.commit()
        await this.notificationsService.createNotification({
          action: 'apagou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: null,
          notificationType: 4,
          objectUserId: currentUser.user_id,
          oldData: {
            funcao: approved.function,
            local: approved.place,
            data_inicio: await this.notificationsService.formatDate(
              approved.past_exp_begin_date
            ),
            data_conclusao: await this.notificationsService.formatDate(
              approved.past_exp_end_date
            ),
            pessoa: approved.name
          },
          table: 'Experiências eclesiásticas anteriores'
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
    message = 'PastEclExp deleted successfully.'
    return message
  }
}
