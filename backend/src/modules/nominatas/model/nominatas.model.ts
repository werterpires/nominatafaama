import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  IBasicProfessor,
  IBasicStudent,
  ICreateNominata,
  INominata,
  ISinteticProfessor,
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
        nominata = {
          nominata_id: degree_id,
          year: createNominataData.year,
          orig_field_invites_begin: createNominataData.orig_field_invites_begin,
          director_words: createNominataData.director_words,
          director: createNominataData.director,
          class_photo: null,
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
        await trx('nominatas_students')
          .where('nominata_id', nominata_id)
          .delete()

        if (students.length > 0) {
          await trx('nominatas_students').insert(students)
        }

        await trx.commit()
      } catch (error) {
        console.error(
          `Erro capturado na função addStudentsToNominata, na nominatasModel: ${error}`,
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

  async addProfessorsToNominata(
    professor_id: number[],
    nominata_id: number,
  ): Promise<boolean> {
    let nominata: INominata | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const professors: {
          professor_id: number
          nominata_id: number
        }[] = []

        professor_id.forEach((professor) => {
          professors.push({
            professor_id: professor,
            nominata_id: nominata_id,
          })
        })
        await trx('nominatas_professors')
          .where('nominata_id', nominata_id)
          .delete()

        if (professors.length > 0) {
          await trx('nominatas_professors').insert(professors)
        }

        await trx.commit()
        const [id] = await trx('nominatas_professors')
          .insert({ nominata_id, professor_id })
          .returning('nominata_id')

        await trx.commit()
      } catch (error) {
        console.error(
          `Erro capturado na função addProfessorsToNominata, na nominatasModel: ${error}`,
        )
        await trx.rollback()

        sentError = new Error(error.sqlMessage)
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

        if (!result || result.length < 1) {
          throw new Error('Nominata not found')
        }

        nominata = {
          nominata_id: result.nominata_id,
          year: result.year,
          orig_field_invites_begin: result.orig_field_invites_begin,
          director_words: result.director_words,
          class_photo: result.class_photo,
          created_at: result.created_at,
          updated_at: result.updated_at,
          director: result.director,
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
    return students
  }

  async findAllNominataProfessors(): Promise<ISinteticProfessor[]> {
    let professors: ISinteticProfessor[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('professors')
          .select([
            'people.name',
            'professors.professor_id',
            'professors.person_id',
            'people.cpf',
            'nominatas_professors.nominata_id',
            'professors.assignments',
          ])
          .leftJoin('people', 'professors.person_id', 'people.person_id')
          .leftJoin(
            'nominatas_professors',
            'professors.professor_id',
            'nominatas_professors.professor_id',
          )

        professors = Object.values(
          result.reduce((acc, curr) => {
            if (!acc[curr.professor_id]) {
              acc[curr.professor_id] = { ...curr, nominata_id: [] }
            }
            if (curr.nominata_id !== null) {
              acc[curr.professor_id].nominata_id.push(curr.nominata_id)
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

    return professors
  }

  async findNominataPhotoByNominataId(
    nominataId: number,
  ): Promise<string | null> {
    let nominataPhoto: string | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('nominatas')
          .where('nominata_id', '=', nominataId)
          .first()

        if (!result) {
          return
        }

        nominataPhoto = result.class_photo

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

    return nominataPhoto
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

  async findAllNominataBasicProfessors(
    nominata_id: number,
  ): Promise<IBasicProfessor[] | null> {
    let professors: IBasicProfessor[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        professors = await this.knex
          .select(
            'professors.professor_id',
            'users.user_id',
            'professors.person_id',
            'people.name',
            'professors.assignments',
            'professors.professor_photo_address',
          )
          .from('professors')
          .leftJoin('people', 'professors.person_id', 'people.person_id')
          .leftJoin('users', 'professors.person_id', 'users.person_id')
          .leftJoin(
            'nominatas_professors',
            'professors.professor_id',
            'nominatas_professors.professor_id',
          )
          .where('nominatas_professors.nominata_id', nominata_id)

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

    return professors
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
          class_photo: result.class_photo,
          director: result.director,
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

  // async findStudentsIds(nominata_id: number): Promise<INominata | null> {
  //   let nominata: INominata | null = null
  //   let sentError: Error | null = null

  //   await this.knex.transaction(async (trx) => {
  //     try {
  //       const result = await trx
  //         .table('nominatas')
  //         .first('*')
  //         .where('nominata_id', '=', nominata_id)

  //       if (!result) {
  //         throw new Error('Nominata not found')
  //       }

  //       nominata = {
  //         nominata_id: result.nominata_id,
  //         year: result.year,
  //         orig_field_invites_begin: result.orig_field_invites_begin,
  //         director_words: result.director_words,
  //         created_at: result.created_at,
  //         updated_at: result.updated_at,
  //       }

  //       await trx.commit()
  //     } catch (error) {
  //       console.error(error)
  //       sentError = new Error(error.message)
  //       await trx.rollback()
  //       throw error
  //     }
  //   })

  //   if (sentError) {
  //     throw sentError
  //   }

  //   return nominata
  // }

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
          class_photo: row.class_photo,
          director: row.director,
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

  async updateNominataPhoto(
    class_photo: string,
    nominata_id,
  ): Promise<INominata> {
    let updatedNominata: INominata | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        await trx('nominatas').where('nominata_id', nominata_id).update({
          class_photo,
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

    updatedNominata = await this.findNominataById(nominata_id)
    if (updatedNominata === null) {
      throw new Error('Falha ao atualizar a foto da nominata.')
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
