import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import { ICreateChild, IChild, IUpdateChild } from '../types/types'

@Injectable()
export class ChildrenModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createChild(createChildData: ICreateChild): Promise<number> {
    let childId!: number
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          child_birth_date,
          study_grade,
          marital_status_id,
          student_id,
          child_approved,
          name,
          cpf,
        } = createChildData

        const personId = await trx('people')
          .insert({ name, cpf })
          .returning('person_id')[0].person_id

        ;[childId] = await trx('children')
          .insert({
            child_birth_date,
            study_grade,
            marital_status_id,
            person_id: personId,
            student_id,
            child_approved,
          })
          .returning('child_id')[0].child_id

        await trx.commit()
      } catch (error) {
        console.error(error)
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Child already exists')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    if (!childId) {
      throw new Error('Failed to create child')
    }

    return childId
  }

  async findChildById(id: number): Promise<IChild> {
    let child: IChild | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('children')
          .first(
            'children.*',
            'marital_status_types.marital_status_type_name',
            'people.name',
            'people.cpf',
          )
          .leftJoin(
            'marital_status_types',
            'children.marital_status_id',
            'marital_status_types.marital_status_type_id',
          )
          .leftJoin('people', 'children.person_id', 'people.person_id')
          .where('child_id', '=', id)

        if (!result) {
          throw new Error('Child not found')
        }

        child = {
          child_id: result.child_id,
          child_birth_date: result.child_birth_date,
          study_grade: result.study_grade,
          marital_status_id: result.marital_status_id,
          person_id: result.person_id,
          student_id: result.student_id,
          child_approved: result.child_approved,
          marital_status_type_name: result.marital_status_type_name,
          name: result.name,
          cpf: result.cpf,
          created_at: result.created_at,
          updated_at: result.updated_at,
        }

        await trx.commit()
      } catch (error) {
        console.error(error)
        console.log(error)
        sentError = new Error(error.message)
        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    if (child === null) {
      throw new Error('Child not found')
    }

    return child
  }

  async findAllChildren(): Promise<IChild[]> {
    let childrenList: IChild[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('children')
          .select(
            'children.*',
            'marital_status_types.marital_status_type_name',
            'people.name',
            'people.cpf',
          )
          .leftJoin('people', 'children.person_id', 'people.person_id')
          .leftJoin(
            'marital_status_types',
            'children.marital_status_id',
            'marital_status_types.marital_status_type_id',
          )

        childrenList = results.map((row: any) => ({
          child_id: row.child_id,
          child_birth_date: row.child_birth_date,
          study_grade: row.study_grade,
          marital_status_id: row.marital_status_id,
          person_id: row.person_id,
          student_id: row.student_id,
          child_approved: row.child_approved,
          marital_status_type_name: row.marital_status_type_name,
          name: row.name,
          cpf: row.cpf,
          created_at: row.created_at,
          updated_at: row.updated_at,
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

    return childrenList
  }

  async findChildrenByStudentId(student_id: number): Promise<IChild[]> {
    let childrenList: IChild[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('children')
          .select(
            'children.*',
            'marital_status_types.marital_status_type_name',
            'people.name',
            'people.cpf',
          )
          .leftJoin('people', 'children.person_id', 'people.person_id')
          .leftJoin(
            'marital_status_types',
            'children.marital_status_id',
            'marital_status_types.marital_status_type_id',
          )
          .where('children.student_id', '=', student_id)

        childrenList = results.map((row: any) => ({
          child_id: row.child_id,
          child_birth_date: row.child_birth_date,
          study_grade: row.study_grade,
          marital_status_id: row.marital_status_id,
          person_id: row.person_id,
          student_id: row.student_id,
          child_approved: row.child_approved,
          marital_status_type_name: row.marital_status_type_name,
          name: row.name,
          cpf: row.cpf,
          created_at: row.created_at,
          updated_at: row.updated_at,
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

    return childrenList
  }

  async updateChildById(updateChild: IUpdateChild): Promise<number> {
    let updatedChild: number | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          child_id,
          child_birth_date,
          study_grade,
          marital_status_id,
          person_id,
          student_id,
          child_approved,
          name,
          cpf,
        } = updateChild

        const updatedPerson = await trx('people')
          .where('person_id', person_id)
          .update({
            name,
            cpf,
          })

        updatedChild = await trx('children')
          .where('child_id', child_id)
          .update({
            child_birth_date,
            study_grade,
            marital_status_id,
            person_id,
            student_id,
            child_approved,
          })

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

    if (updatedChild === null) {
      throw new Error('Child not found')
    }

    return updatedChild
  }

  async deleteChildById(id: number): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        const existingChild = await trx('children')
          .select('child_id', 'person_id')
          .where('child_id', id)
          .first()

        if (!existingChild) {
          throw new Error('Child not found')
        }

        await trx('children').where('child_id', existingChild.child_id).del()
        await trx('people').where('person_id', existingChild.person_id).del()

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

    message = 'Child deleted successfully'
    return message
  }
}
