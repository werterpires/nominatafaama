import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  ICreateProfessor,
  ICreateProfessorAssgnment,
  IProfessor,
  IUpdateProfessor,
} from '../types/types'

@Injectable()
export class ProfessorsModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createProfessor(
    createProfessor: ICreateProfessorAssgnment,
  ): Promise<IProfessor> {
    let professor: IProfessor | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        if (
          createProfessor.name &&
          createProfessor.cpf &&
          !createProfessor.person_id
        ) {
          createProfessor.person_id = await trx('people').insert({
            name: createProfessor.name,
            cpf: createProfessor.cpf,
          })
        }

        const [professor_id] = await trx('professors')
          .insert({
            person_id: createProfessor.person_id,
            assignments: createProfessor.assignments,
            approved: createProfessor.approved,
          })
          .returning('professor_id')

        await trx.commit()

        professor = await this.findProfessorById(professor_id)
      } catch (error) {
        console.error(error)
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Professor já existe')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return professor!
  }

  async findProfessorById(id: number): Promise<IProfessor | null> {
    const result = await this.knex
      .table('professors')
      .first(
        'professors.*',
        'people.name as person_name',
        'people.person_id as person_id',
      )
      .leftJoin('users', 'professors.person_id', 'users.person_id')
      .leftJoin('people', 'professors.person_id', 'people.person_id')
      .where('professors.professor_id', '=', id)

    if (!result) {
      throw new Error('Professor não encontrado')
    }

    return result
  }

  async findProfessorByUserId(userId: number): Promise<IProfessor | null> {
    let professor: IProfessor | null = null
    let sentError: Error | null = null
    try {
      const result = await this.knex
        .table('professors')
        .first(
          'professors.*',
          'people.name as person_name',
          'people.person_id as person_id',
        )
        .leftJoin('users', 'professors.person_id', 'users.person_id')
        .leftJoin('people', 'professors.person_id', 'people.person_id')
        .where('users.user_id', userId)

      if (result != null) {
        professor = result
      }
    } catch (error) {
      console.error('Esse é o erro capturado na model: ', error)
      sentError = new Error(error.message)
    }

    if (sentError) {
      throw sentError
    }

    return professor
  }

  async updateProfessorById(
    updateProfessor: IUpdateProfessor,
  ): Promise<IProfessor> {
    let updatedProfessor: IProfessor | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { assignments, approved, professor_id } = updateProfessor

        await trx('professors').where('professor_id', professor_id).update({
          assignments,
          approved,
        })

        await trx.commit()
      } catch (error) {
        console.error(error)
        console.error(error)
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    updatedProfessor = await this.findProfessorById(
      updateProfessor.professor_id,
    )
    if (updatedProfessor === null) {
      throw new Error('Falha ao atualizar professor.')
    }

    return updatedProfessor
  }

  async updateProfessorPhoto(
    professor_photo_address: string,
    professor_id,
  ): Promise<IProfessor> {
    let updatedProfessor: IProfessor | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        await trx('professors').where('professor_id', professor_id).update({
          professor_photo_address,
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

    updatedProfessor = await this.findProfessorById(professor_id)
    if (updatedProfessor === null) {
      throw new Error('Falha ao cadastrar a foto do professor.')
    }

    return updatedProfessor
  }

  async findProfessorPhotoByProfessorId(
    professorId: number,
  ): Promise<string | null> {
    let professorPhoto: string | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('professors')
          .where('professor_id', '=', professorId)
          .first()

        if (!result) {
          return
        }

        professorPhoto = result.professor_photo_address

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

    return professorPhoto
  }

  async deleteProfessorById(id: number): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        await trx('professors').where('professor_id', id).del()

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

    message = 'Professor excluído com sucesso.'
    return message
  }
}
