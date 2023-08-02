import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  IBasicStudent,
  ICreateNominata,
  INominata,
  ISinteticStudent,
  IUpdateNominata,
} from '../types/types'

@Injectable()
export class NominatasModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createNominata(
    createNominataData: ICreateNominata,
  ): Promise<INominata> {
    let nominata: INominata | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const [degree_id] = await trx('nominatas')
          .insert(createNominataData)
          .returning('degree_id')
        console.log('estou mesmo entrando aui')
        nominata = {
          nominata_id: degree_id,
          year: createNominataData.year,
          orig_field_invites_begin: createNominataData.orig_field_invites_begin,
          director_words: createNominataData.director_words,
          created_at: new Date(),
          updated_at: new Date(),
        }

        await trx.commit()
      } catch (error) {
        console.error(
          `Erro capturado na função createNominata, na nominatasModel: ${error}`,
        )
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Já existe uma nominata com esses dados')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return nominata!
  }

  async addStudentsToNominata(
    student_id: number[],
    nominata_id: number,
  ): Promise<boolean> {
    let nominata: INominata | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const students: {
          student_id: number
          nominata_id: number
        }[] = []

        student_id.forEach((student) => {
          students.push({
            student_id: student,
            nominata_id: nominata_id,
          })
        })
        console.log(nominata_id)
        await trx('nominatas_students')
          .where('nominata_id', nominata_id)
          .delete()

        if (students.length > 0) {
          await trx('nominatas_students').insert(students)
        }

        await trx.commit()
        const [degree_id] = await trx('nominatas_students')
          .insert({ nominata_id, student_id })
          .returning('nominata_id')

        await trx.commit()

        nominata = await this.findNominataById(nominata_id)
      } catch (error) {
        console.error(
          `Erro capturado na função createNominata, na nominatasModel: ${error}`,
        )
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Já existe uma nominata com esses dados')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return true
  }

  async findNominataById(id: number): Promise<INominata | null> {
    let nominata: INominata | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('nominatas')
          .first('*')
          .where('nominata_id', '=', id)

        if (result.length < 1) {
          throw new Error('Nominata not found')
        }

        nominata = {
          nominata_id: result.nominata_id,
          year: result.year,
          orig_field_invites_begin: result.orig_field_invites_begin,
          director_words: result.director_words,
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

    return nominata
  }

  async findAllNominataStudents(): Promise<ISinteticStudent[]> {
    let students: ISinteticStudent[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('students')
          .select([
            'people.name',
            'students.student_id',
            'students.person_id',
            'people.cpf',
            'nominatas_students.nominata_id',
          ])
          .leftJoin('people', 'students.person_id', 'people.person_id')
          .leftJoin(
            'nominatas_students',
            'students.student_id',
            'nominatas_students.student_id',
          )

        students = Object.values(
          result.reduce((acc, curr) => {
            if (!acc[curr.student_id]) {
              acc[curr.student_id] = { ...curr, nominata_id: [] }
            }
            if (curr.nominata_id !== null) {
              acc[curr.student_id].nominata_id.push(curr.nominata_id)
            }
            return acc
          }, {}),
        )

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
    console.log(students)
    return students
  }

  async findAllNominataBasicStudents(
    nominata_id,
  ): Promise<IBasicStudent[] | null> {
    let students: IBasicStudent[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        students = await this.knex
          .select(
            'students.student_id',
            'users.user_id',
            'students.person_id',
            'people.name',
            'unions.union_acronym',
            'associations.association_acronym',
            'hiring_status.hiring_status_name',
            'student_photos.small_alone_photo',
          )
          .from('students')
          .leftJoin('people', 'students.person_id', 'people.person_id')
          .leftJoin('users', 'students.person_id', 'users.person_id')
          .leftJoin(
            'associations',
            'students.origin_field_id',
            'associations.association_id',
          )
          .leftJoin('unions', 'associations.union_id', 'unions.union_id')
          .leftJoin(
            'hiring_status',
            'students.hiring_status_id',
            'hiring_status.hiring_status_id',
          )
          .leftJoin(
            'nominatas_students',
            'students.student_id',
            'nominatas_students.student_id',
          )
          .leftJoin(
            'student_photos',
            'students.student_id',
            'student_photos.student_id',
          )
          .where('nominatas_students.nominata_id', nominata_id)

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

    return students
  }

  async findNominataByYear(year: string): Promise<INominata | null> {
    let nominata: INominata | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('nominatas')
          .first('*')
          .where('year', '=', year)

        if (!result) {
          throw new Error('Nominata not found')
        }

        nominata = {
          nominata_id: result.nominata_id,
          year: result.year,
          orig_field_invites_begin: result.orig_field_invites_begin,
          director_words: result.director_words,
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

    return nominata
  }

  async findStudentsIds(nominata_id: number): Promise<INominata | null> {
    let nominata: INominata | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('nominatas')
          .first('*')
          .where('nominata_id', '=', nominata_id)

        if (!result) {
          throw new Error('Nominata not found')
        }

        nominata = {
          nominata_id: result.nominata_id,
          year: result.year,
          orig_field_invites_begin: result.orig_field_invites_begin,
          director_words: result.director_words,
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

    return nominata
  }

  async findAllNominatas(): Promise<INominata[]> {
    let nominatasList: INominata[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx.table('nominatas').select('*')

        nominatasList = results.map((row: any) => ({
          nominata_id: row.nominata_id,
          year: row.year,
          orig_field_invites_begin: row.orig_field_invites_begin,
          director_words: row.director_words,
          created_at: row.created_at,
          updated_at: row.updated_at,
        }))
        console.log('enviando as nominatas')
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

    return nominatasList
  }

  async updateNominataById(
    updateNominata: IUpdateNominata,
  ): Promise<INominata> {
    let updatedNominata: INominata | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { year } = updateNominata
        const { orig_field_invites_begin } = updateNominata
        const { nominata_id } = updateNominata
        const { director_words } = updateNominata

        await trx('nominatas')
          .where('nominata_id', nominata_id)
          .update({ year, orig_field_invites_begin, director_words })

        updatedNominata = await this.findNominataById(nominata_id)

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

    if (updatedNominata === null) {
      throw new Error('Não foi possível atualizar o grau acadêmico.')
    }

    return updatedNominata
  }

  async deleteNominataById(id: number): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        await trx('nominatas').where('nominata_id', id).del()

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

    message = 'Nominata deletada com sucesso.'
    return message
  }
}
