import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import { IApproveData } from '../types/types'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class ApprovalsModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  tableIndex: { [key: string]: string } = {
    students: 'Estudante',
    academic_formations: 'Formações acadêmicas',
    courses: 'Cursos',
    languages: 'Linguagens',
    publications: 'Publicações',
    endowments: 'Investiduras',
    ordinations: 'Ordenações',
    children: 'Filhos',
    previous_marriages: 'Casamentos anteriores',
    professional_experiences: 'Experiências profissionais',
    past_ecl_exps: 'Experiencias eclesiásticas passadas',
    ecl_experiences: 'Experiencias eclesiásticas',
    evangelistic_experiences: 'Experiências evangelísticas',
    related_ministries: 'Ministros de interesse',
    spouses: 'Cônjuges'
  }

  async approveAny(
    data: IApproveData,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { id, approve, table } = data

        const columns = await this.knex(table).columnInfo()
        let approvedCollumn = ''
        const primaryKeyColumnResult = await this.knex.raw(
          `SHOW KEYS FROM \`${table}\` WHERE Key_name = 'PRIMARY'`
        )

        const primaryKeyColumn = primaryKeyColumnResult[0][0].Column_name

        for (const column in columns) {
          if (column.includes('approved')) {
            approvedCollumn = column
            break
          }
        }

        if (approvedCollumn.length < 1 || !primaryKeyColumn) {
          throw new Error(
            'Não foram encontradas colunas válidas para execuatar a aprovação.'
          )
        }

        await trx(table)
          .update(approvedCollumn, approve)
          .where(primaryKeyColumn, id)

        await trx.commit()

        const hasPersonId = await this.knex.schema.hasColumn(table, 'person_id')
        const hasStudentId = await this.knex.schema.hasColumn(
          table,
          'student_id'
        )

        let personAndOthers

        if (hasPersonId && hasStudentId) {
          personAndOthers = await this.knex(table)
            .leftJoin('students as s', 's.student_id', `${table}.student_id`)
            .leftJoin('users', 'users.person_id', 's.person_id')
            .leftJoin('people', 'people.person_id', `${table}.person_id`)
            .first('people.name', 'people.person_id', 'users.user_id')
            .where(`${table}.${primaryKeyColumn}`, id)
        } else if (hasPersonId && !hasStudentId) {
          personAndOthers = await this.knex(table)
            .leftJoin('people', 'people.person_id', `${table}.person_id`)
            .leftJoin('users', 'users.person_id', 'people.person_id')
            .first('people.name', 'people.person_id', 'users.user_id')
            .where(primaryKeyColumn, id)
        } else if (!hasPersonId && hasStudentId) {
          personAndOthers = await this.knex(table)
            .leftJoin('students', 'students.student_id', `${table}.student_id`)
            .leftJoin('users', 'users.person_id', 'students.person_id')
            .leftJoin('people', 'people.person_id', 'students.person_id')
            .first('people.name', 'people.person_id', 'users.user_id')
            .where(primaryKeyColumn, id)
        } else {
          personAndOthers = null
        }

        let userIdAlt

        if (!personAndOthers.user_id) {
          userIdAlt = await this.knex('spouses')
            .leftJoin('students', 'spouses.student_id', 'students.student_id')
            .leftJoin('users', 'students.person_id', 'users.person_id')
            .where('spouses.person_id', personAndOthers.person_id)
            .first('users.user_id')
        }

        await this.notificationsService.createNotification({
          notificationType: 5,
          newData: {
            aprovado: await this.notificationsService.formateBoolean(approve),
            pessoa: personAndOthers.name
          },
          action: approve ? 'aprovou' : 'desaprovou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          objectUserId: personAndOthers.user_id || userIdAlt.user_id,
          oldData: null,
          table: this.tableIndex[table]
        })
      } catch (error) {
        console.error(`Erro capturado na ApprovalsModel approveAny: ${error}`)

        await trx.rollback()

        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    return true
  }
}
