import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  IAcademicFormation,
  ICreateAcademicFormation,
  IUpdateAcademicFormation
} from '../types/types'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class AcademicFormationsModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async createAcademicFormation(
    createAcademicFormationData: ICreateAcademicFormation,
    currentUser: UserFromJwt
  ): Promise<IAcademicFormation> {
    try {
      const {
        course_area,
        institution,
        begin_date,
        conclusion_date,
        person_id,
        degree_id,
        academic_formation_approved
      } = createAcademicFormationData

      const [formation_id] = await this.knex('academic_formations')
        .insert({
          course_area,
          institution,
          begin_date,
          conclusion_date,
          person_id,
          degree_id,
          academic_formation_approved
        })
        .returning('formation_id')

      const academicFormation = {
        formation_id: formation_id,
        course_area: course_area,
        institution: institution,
        begin_date: begin_date,
        conclusion_date: conclusion_date,
        person_id: person_id,
        degree_id: degree_id,
        created_at: new Date(),
        updated_at: new Date(),
        academic_formation_approved: null,
        degree_name: `${degree_id}`
      }

      const personUndOthers = await this.knex('people')
        .leftJoin(
          'academic_formations',
          'people.person_id',
          'academic_formations.person_id'
        )
        .leftJoin(
          'academic_degrees',
          'academic_formations.degree_id',
          'academic_degrees.degree_id'
        )
        .where('people.person_id', person_id)
        .andWhere('academic_degrees.degree_id', degree_id)
        .select('people.name', 'academic_degrees.degree_name')
        .first()

      await this.notificationsService.createNotification({
        action: 'inseriu',
        agent_name: currentUser.name,
        agentUserId: currentUser.user_id,
        newData: {
          titulacao: personUndOthers.degree_name,
          area: academicFormation.course_area,
          instituicao: academicFormation.institution,
          data_inicio: await this.notificationsService.formatDate(
            academicFormation.begin_date
          ),
          data_conclusao: await this.notificationsService.formatDate(
            academicFormation.conclusion_date
          ),
          pessoa: personUndOthers?.name
        },
        notificationType: 4,
        objectUserId: currentUser.user_id,
        oldData: null,
        table: 'Formações acadêmicas'
      })

      return academicFormation
    } catch (error) {
      console.error(error)
      throw new Error('Erro ao criar a formação acadêmica')
    }
  }

  async findAcademicFormationById(
    id: number
  ): Promise<IAcademicFormation | null> {
    let academicFormation: IAcademicFormation | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('academic_formations')
          .first('academic_formations.*', 'academic_degrees.degree_name')
          .leftJoin(
            'academic_degrees',
            'academic_formations.degree_id',
            'academic_degrees.degree_id'
          )
          .where('formation_id', '=', id)

        if (result.length < 1) {
          throw new Error('Academic Formation not found')
        }

        academicFormation = {
          formation_id: result.formation_id,
          course_area: result.course_area,
          institution: result.institution,
          begin_date: result.begin_date,
          conclusion_date: result.conclusion_date,
          person_id: result.person_id,
          academic_formation_approved: result.academic_formation_approved,
          created_at: result.created_at,
          updated_at: result.updated_at,
          degree_id: result.degree_id,
          degree_name: result.degree_name
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

    return academicFormation
  }

  async findAllNotApprovedPersonIds(): Promise<{ person_id: number }[] | null> {
    let personIds: { person_id: number }[] | null = null
    let sentError: Error | null = null

    try {
      const studentResult = await this.knex
        .table('academic_formations')
        .join('users', 'users.person_id', 'academic_formations.person_id')
        .select('users.person_id')
        .whereNull('academic_formation_approved')

      const spouseResult = await this.knex
        .table('academic_formations')
        .join('spouses', 'spouses.person_id', 'academic_formations.person_id')
        .join('students', 'students.student_id', 'spouses.student_id')
        .select('students.person_id')
        .whereNull('academic_formations.academic_formation_approved')

      personIds = [...studentResult, ...spouseResult].map((row) => ({
        person_id: row.person_id
      }))
    } catch (error) {
      console.error('Erro capturado na model: ', error)
      sentError = new Error(error.message)
    }

    return personIds
  }

  async findAllAcademicFormations(): Promise<IAcademicFormation[]> {
    let academicFormationsList: IAcademicFormation[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('academic_formations')
          .select('academic_formations.*', 'academic_degrees.degree_name')
          .leftJoin(
            'academic_degrees',
            'academic_formations.degree_id',
            'academic_degrees.degree_id'
          )

        academicFormationsList = results.map((row: any) => ({
          formation_id: row.formation_id,
          course_area: row.course_area,
          institution: row.institution,
          begin_date: row.begin_date,
          conclusion_date: row.conclusion_date,
          person_id: row.person_id,
          academic_formation_approved: row.academic_formation_approved,
          created_at: row.created_at,
          updated_at: row.updated_at,
          degree_id: row.updated_at,
          degree_name: row.degree_name
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

    return academicFormationsList
  }

  async findAcademicFormationsByPersonId(
    personId: number
  ): Promise<IAcademicFormation[]> {
    let academicFormationsList: IAcademicFormation[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('academic_formations')
          .select('academic_formations.*', 'academic_degrees.degree_name')
          .leftJoin(
            'academic_degrees',
            'academic_formations.degree_id',
            'academic_degrees.degree_id'
          )
          .where('academic_formations.person_id', '=', personId)
        academicFormationsList = results.map((row: any) => ({
          formation_id: row.formation_id,
          course_area: row.course_area,
          institution: row.institution,
          begin_date: row.begin_date,
          conclusion_date: row.conclusion_date,
          person_id: row.person_id,
          academic_formation_approved: row.academic_formation_approved,
          degree_name: row.degree_name,
          created_at: row.created_at,
          updated_at: row.updated_at,
          degree_id: row.degree_id
        }))

        await trx.commit()
      } catch (error) {
        console.error(error)
        console.error(error)
        await trx.rollback()
        sentError = new Error(error.sqlMessage)
      }
    })

    if (sentError) {
      throw sentError
    }

    return academicFormationsList
  }

  async findApprovedAcademicFormationsByPersonId(
    personId: number
  ): Promise<IAcademicFormation[]> {
    let academicFormationsList: IAcademicFormation[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('academic_formations')
          .select('academic_formations.*', 'academic_degrees.degree_name')
          .leftJoin(
            'academic_degrees',
            'academic_formations.degree_id',
            'academic_degrees.degree_id'
          )
          .where('academic_formations.person_id', '=', personId)
          .andWhere(
            'academic_formations.academic_formation_approved',
            '=',
            true
          )

        results.sort((a, b) => {
          if (!a.conclusion_date && !b.conclusion_date) return 0
          if (!a.conclusion_date) return 1
          if (!b.conclusion_date) return -1
          return (
            new Date(a.conclusion_date).getTime() -
            new Date(b.conclusion_date).getTime()
          )
        })

        academicFormationsList = results.map((row: any) => ({
          formation_id: row.formation_id,
          course_area: row.course_area,
          institution: row.institution,
          begin_date: row.begin_date,
          conclusion_date: row.conclusion_date,
          person_id: row.person_id,
          academic_formation_approved: row.academic_formation_approved,
          degree_name: row.degree_name,
          created_at: row.created_at,
          updated_at: row.updated_at,
          degree_id: row.degree_id
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

    return academicFormationsList
  }

  async updateAcademicFormationById(
    updateAcademicFormation: IUpdateAcademicFormation,
    currentUser: UserFromJwt
  ): Promise<IAcademicFormation> {
    let updatedAcademicFormation: IAcademicFormation | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          formation_id,
          degree_id,
          course_area,
          institution,
          begin_date,
          conclusion_date,
          academic_formation_approved
        } = updateAcademicFormation

        let approved = await trx('academic_formations')
          .first('*')
          .leftJoin(
            'academic_degrees',
            'academic_formations.degree_id',
            'academic_degrees.degree_id'
          )
          .leftJoin(
            'people',
            'academic_formations.person_id',
            'people.person_id'
          )
          .leftJoin('users', 'academic_formations.person_id', 'users.person_id')
          .where('formation_id', formation_id)

        if (approved.academic_formation_approved == true) {
          throw new Error('Registro já aprovado')
        }
        await trx('academic_formations')
          .where('formation_id', formation_id)
          .update({
            degree_id,
            course_area,
            institution,
            begin_date,
            conclusion_date,
            academic_formation_approved
          })

        updatedAcademicFormation = await this.findAcademicFormationById(
          formation_id
        )

        await trx.commit()

        let userIdAlt
        if (!approved.user_id) {
          userIdAlt = await this.knex('spouses')
            .leftJoin('students', 'spouses.student_id', 'students.student_id')
            .leftJoin('users', 'students.person_id', 'users.person_id')
            .where('spouses.person_id', approved.person_id)
            .first('users.user_id')
        }

        const personUndOthers = await this.knex('people')
          .leftJoin(
            'academic_formations',
            'people.person_id',
            'academic_formations.person_id'
          )
          .leftJoin(
            'academic_degrees',
            'academic_formations.degree_id',
            'academic_degrees.degree_id'
          )
          .where('people.person_id', approved.person_id)
          .andWhere('academic_degrees.degree_id', degree_id)
          .select('people.name', 'academic_degrees.degree_name')
          .first()

        await this.notificationsService.createNotification({
          action: 'editou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: {
            titulacao: personUndOthers.degree_name,
            area: updateAcademicFormation.course_area,
            instituicao: updateAcademicFormation.institution,
            data_inicio: await this.notificationsService.formatDate(
              updateAcademicFormation.begin_date
            ),
            data_conclusao: await this.notificationsService.formatDate(
              updateAcademicFormation.conclusion_date
            ),
            pessoa: personUndOthers?.name
          },
          notificationType: 4,
          objectUserId: approved.user_id || userIdAlt.user_id,
          oldData: {
            titulacao: approved.degree_name,
            area: approved.course_area,
            instituicao: approved.institution,
            data_inicio: await this.notificationsService.formatDate(
              approved.begin_date
            ),
            data_conclusao: await this.notificationsService.formatDate(
              approved.conclusion_date
            ),
            pessoa: personUndOthers?.name
          },
          table: 'Formações acadêmicas'
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

    if (!updatedAcademicFormation) {
      throw new Error('Academic Formation not found')
    }

    return updatedAcademicFormation
  }

  async deleteAcademicFormationById(id: number, currentUser): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        let approved = await trx('academic_formations')
          .first('*')
          .leftJoin(
            'academic_degrees',
            'academic_formations.degree_id',
            'academic_degrees.degree_id'
          )
          .leftJoin(
            'people',
            'people.person_id',
            'academic_formations.person_id'
          )
          .where('formation_id', id)

        if (!approved) {
          throw new Error('Academic Formation not found')
        }

        if (approved.academic_formation_approved == true) {
          throw new Error('Registro já aprovado')
        }

        await trx('academic_formations').where('formation_id', id).del()

        await trx.commit()
        await this.notificationsService.createNotification({
          action: 'apagou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: null,
          notificationType: 4,
          objectUserId: currentUser.user_id,
          oldData: {
            titulacao: approved.degree_name,
            area: approved.course_area,
            instituicao: approved.institution,
            data_inicio: await this.notificationsService.formatDate(
              approved.begin_date
            ),
            data_conclusao: await this.notificationsService.formatDate(
              approved.conclusion_date
            ),
            pessoa: approved.name
          },
          table: 'Formações acadêmicas'
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

    message = 'Academic Formation deleted successfully.'
    return message
  }
}
