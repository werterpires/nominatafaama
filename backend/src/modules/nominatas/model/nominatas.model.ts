import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import { ICreateNominata, INominata, IUpdateNominata } from '../types/types'

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

        await trx('nominatas')
          .where('nominata_id', nominata_id)
          .update({ year, orig_field_invites_begin })

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
