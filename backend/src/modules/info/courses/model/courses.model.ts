import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import { ICreateCourse, ICourse, IUpdateCourse } from '../types/types'

@Injectable()
export class CoursesModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createCourse(createCourseData: ICreateCourse): Promise<ICourse> {
    let course: ICourse | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          course_area,
          institution,
          begin_date,
          conclusion_date,
          person_id,
          course_approved,
        } = createCourseData

        const [course_id] = await trx('courses')
          .insert({
            course_area,
            institution,
            begin_date,
            conclusion_date,
            person_id,
            course_approved,
          })
          .returning('course_id')

        await trx.commit()

        course = await this.findCourseById(course_id)
      } catch (error) {
        console.error(error)
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Course already exists')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return course!
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

  async updateCourseById(updateCourse: IUpdateCourse): Promise<ICourse> {
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
          course_approved,
        } = updateCourse

        await trx('courses').where('course_id', course_id).update({
          course_area,
          institution,
          begin_date,
          conclusion_date,
          person_id,
          course_approved,
        })

        await trx.commit()

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

  async deleteCourseById(id: number): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        const existingCourse = await trx('courses')
          .select('course_id')
          .where('course_id', id)
          .first()

        if (!existingCourse) {
          throw new Error('Course not found')
        }

        await trx('courses').where('course_id', id).del()

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

    message = 'Course deleted successfully.'
    return message
  }
}
