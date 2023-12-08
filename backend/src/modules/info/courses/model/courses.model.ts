import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import { ICreateCourse, ICourse, IUpdateCourse } from '../types/types'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class CoursesModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async createCourse(
    createCourseData: ICreateCourse,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      const {
        course_area,
        institution,
        begin_date,
        conclusion_date,
        person_id,
        course_approved
      } = createCourseData

      await this.knex('courses')
        .insert({
          course_area,
          institution,
          begin_date,
          conclusion_date,
          person_id,
          course_approved
        })
        .returning('course_id')

      const personUndOthers = await this.knex('people')
        .where('people.person_id', person_id)
        .select('people.name')
        .first()

      await this.notificationsService.createNotification({
        action: 'inseriu',
        agent_name: currentUser.name,
        agentUserId: currentUser.user_id,
        newData: {
          curso: createCourseData.course_area,
          instituição: createCourseData.institution,
          data_inicio: await this.notificationsService.formatDate(
            createCourseData.begin_date
          ),
          data_conclusao: await this.notificationsService.formatDate(
            createCourseData.conclusion_date
          ),
          pessoa: personUndOthers?.name
        },
        notificationType: 4,
        objectUserId: currentUser.user_id,
        oldData: null,
        table: 'Cursos'
      })

      return true
    } catch (error) {
      console.error(error)
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Course already exists')
      } else {
        throw new Error(error.sqlMessage)
      }
    }
  }

  async findCourseById(id: number): Promise<ICourse | null> {
    let course: ICourse | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('courses')
          .where('course_id', '=', id)
          .first()

        if (!result) {
          throw new Error('Course not found')
        }

        course = {
          course_id: result.course_id,
          course_area: result.course_area,
          institution: result.institution,
          begin_date: result.begin_date,
          conclusion_date: result.conclusion_date,
          person_id: result.person_id,
          course_approved: result.course_approved,
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

    return course
  }

  async findCoursesByPersonId(personId: number): Promise<ICourse[]> {
    let courseList: ICourse[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        courseList = await trx
          .table('courses')
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

    return courseList
  }

  async findApprovedCoursesByPersonId(personId: number): Promise<ICourse[]> {
    let courseList: ICourse[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        courseList = await trx
          .table('courses')
          .where('person_id', '=', personId)
          .andWhere('course_approved', '=', true)
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

    return courseList
  }

  async findAllCourses(): Promise<ICourse[]> {
    let courseList: ICourse[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        courseList = await trx.table('courses').select('*')

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

    return courseList
  }

  async findAllNotApprovedPersonIds(): Promise<{ person_id: number }[] | null> {
    let personIds: { person_id: number }[] | null = null
    let sentError: Error | null = null

    try {
      const studentResult = await this.knex
        .table('courses')
        .join('users', 'users.person_id', 'courses.person_id')
        .select('users.person_id')
        .whereNull('course_approved')

      const spouseResult = await this.knex
        .table('courses')
        .join('spouses', 'spouses.person_id', 'courses.person_id')
        .join('students', 'students.student_id', 'spouses.student_id')
        .select('students.person_id')
        .whereNull('courses.course_approved')

      personIds = [...studentResult, ...spouseResult].map((row) => ({
        person_id: row.person_id
      }))
    } catch (error) {
      console.error('Erro capturado na model: ', error)
      sentError = new Error(error.message)
    }

    return personIds
  }

  async updateCourseById(
    updateCourse: IUpdateCourse,
    currentUser: UserFromJwt
  ): Promise<ICourse> {
    let updatedCourse: ICourse | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          course_id,
          course_area,
          institution,
          begin_date,
          conclusion_date,
          person_id,
          course_approved
        } = updateCourse

        let approved = await trx('courses')
          .leftJoin('users', 'users.person_id', 'courses.person_id')
          .first('*')
          .where('course_id', course_id)

        if (approved.course_approved == true) {
          throw new Error('Registro já aprovado')
        }

        await trx('courses').where('course_id', course_id).update({
          course_area,
          institution,
          begin_date,
          conclusion_date,
          person_id,
          course_approved
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
            curso: course_area,
            instituição: institution,
            data_inicio: await this.notificationsService.formatDate(begin_date),
            data_conclusao: await this.notificationsService.formatDate(
              conclusion_date
            ),
            pessoa: personUndOthers?.name
          },
          notificationType: 4,
          objectUserId: approved.user_id || userIdAlt.user_id,
          oldData: {
            curso: approved.course_area,
            instituição: approved.institution,
            data_inicio: await this.notificationsService.formatDate(
              approved.begin_date
            ),
            data_conclusao: await this.notificationsService.formatDate(
              approved.conclusion_date
            ),
            pessoa: personUndOthers?.name
          },
          table: 'Cursos'
        })

        updatedCourse = await this.findCourseById(course_id)
      } catch (error) {
        console.error(error)
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    return updatedCourse!
  }

  async deleteCourseById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        let approved = await trx('courses').first('*').where('course_id', id)

        if (!approved) {
          throw new Error('Course not found')
        }

        if (approved.course_approved == true) {
          throw new Error('Registro já aprovado')
        }

        await trx('courses').where('course_id', id).del()

        await trx.commit()
        const personUndOthers = await this.knex('people')
          .where('people.person_id', approved.person_id)
          .select('people.name')
          .first()

        await this.notificationsService.createNotification({
          action: 'apagou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: null,
          notificationType: 4,
          objectUserId: currentUser.user_id,
          oldData: {
            curso: approved.course_area,
            instituição: approved.institution,
            data_inicio: await this.notificationsService.formatDate(
              approved.begin_date
            ),
            data_conclusao: await this.notificationsService.formatDate(
              approved.conclusion_date
            ),
            pessoa: personUndOthers?.name
          },
          table: 'Cursos'
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

    message = 'Course deleted successfully.'
    return message
  }
}
