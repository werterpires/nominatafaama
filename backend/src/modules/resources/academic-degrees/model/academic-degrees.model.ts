import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  IAcademicDegree,
  ICreateAcademicDegree,
  IUpdateAcademicDegree,
} from '../types/types'

@Injectable()
export class AcademicDegreesModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createAcademicDegree({
    degree_name,
  }: ICreateAcademicDegree): Promise<IAcademicDegree> {
    let academicDegree: IAcademicDegree | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx('academic_degrees')
          .insert({
            degree_name,
          })
          .returning('degree_id')[0].degree_id

        academicDegree = {
          degree_id: result,
          degree_name,
          created_at: new Date(),
          updated_at: new Date(),
        }

        await trx.commit()
      } catch (error) {
        console.error(error)
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Academic Degree type already exists')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return academicDegree!
  }

  async findAcademicDegreeById(id: number): Promise<IAcademicDegree | null> {
    let academicDegree: IAcademicDegree | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('academic_degrees')
          .select('*')
          .where('degree_id', '=', id)

        if (result.length < 1) {
          throw new Error('Academic Degree not found')
        }

        academicDegree = {
          degree_id: result[0].degree_id,
          degree_name: result[0].degree_name,
          created_at: result[0].created_at,
          updated_at: result[0].updated_at,
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

    return academicDegree
  }

  async findAllAcademicDegrees(): Promise<IAcademicDegree[]> {
    let academicDegreesList: IAcademicDegree[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx.table('academic_degrees').select('*')

        academicDegreesList = results.map((row: any) => ({
          degree_id: row.degree_id,
          degree_name: row.degree_name,
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

    return academicDegreesList
  }

  async updateAcademicDegreeById(
    updateAcademicDegree: IUpdateAcademicDegree,
  ): Promise<IAcademicDegree> {
    let updatedAcademicDegree: IAcademicDegree | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { degree_name } = updateAcademicDegree
        const { degree_id } = updateAcademicDegree

        await trx('academic_degrees')
          .where('degree_id', degree_id)
          .update({ degree_name })

        updatedAcademicDegree = await this.findAcademicDegreeById(degree_id)

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

    if (updatedAcademicDegree === null) {
      throw new Error('Não foi possível atualizar o grau acadêmico.')
    }

    return updatedAcademicDegree
  }

  async deleteAcademicDegreeById(id: number): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        await trx('academic_degrees').where('degree_id', id).del()

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

    message = 'Academic Degree deletado com sucesso.'
    return message
  }
}
