import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  ICreatePublicationType,
  IPublicationType,
  IUpdatePublicationType,
} from '../types/types'

@Injectable()
export class PublicationTypeModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createPublicationType({
    publication_type,
    instructions,
  }: ICreatePublicationType): Promise<IPublicationType> {
    let publicationType: IPublicationType | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const [result] = await trx('publication_types').insert(
          {
            publication_type,
            instructions,
          },
          '*',
          {
            includeTriggerModifications: true,
          },
        )

        publicationType = {
          publication_type_id: result,
          publication_type,
          instructions,
          created_at: new Date(),
          updated_at: new Date(),
        }

        await trx.commit()
      } catch (error) {
        console.error(error)
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Publication Type already exists')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return publicationType!
  }

  async findPublicationTypeById(id: number): Promise<IPublicationType | null> {
    let publicationType: IPublicationType | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('publication_types')
          .first('*')
          .where('publication_type_id', '=', id)

        if (result.length < 1) {
          throw new Error('Publication Type not found')
        }

        publicationType = {
          publication_type_id: result.publication_type_id,
          publication_type: result.publication_type,
          instructions: result.instructions,
          created_at: result.created_at,
          updated_at: result.updated_at,
        }

        await trx.commit()
      } catch (error) {
        sentError = new Error(error.message)
        await trx.rollback()
        throw error
      }
    })

    if (sentError) {
      throw sentError
    }

    return publicationType
  }

  async findAllPublicationTypes(): Promise<IPublicationType[]> {
    let publicationTypeList: IPublicationType[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx.table('publication_types').select('*')

        publicationTypeList = results.map((row: any) => ({
          publication_type_id: row.publication_type_id,
          publication_type: row.publication_type,
          instructions: row.instructions,
          created_at: row.created_at,
          updated_at: row.updated_at,
        }))

        await trx.commit()
      } catch (error) {
        await trx.rollback()
        sentError = new Error(error.sqlMessage)
      }
    })

    if (sentError) {
      throw sentError
    }

    return publicationTypeList
  }

  async updatePublicationTypeById(
    updatePublicationType: IUpdatePublicationType,
  ): Promise<IPublicationType> {
    let updatedPublicationType: IPublicationType | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { publication_type, instructions, publication_type_id } =
          updatePublicationType

        await trx('publication_types')
          .where('publication_type_id', publication_type_id)
          .update({ publication_type, instructions })

        updatedPublicationType = await this.findPublicationTypeById(
          publication_type_id,
        )

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

    if (updatedPublicationType === null) {
      throw new Error('Failed to update publication type.')
    }

    return updatedPublicationType
  }

  async deletePublicationTypeById(id: number): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        await trx('publication_types').where('publication_type_id', id).del()

        await trx.commit()
      } catch (error) {
        sentError = new Error(error.message)
        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    message = 'Publication type deleted successfully.'
    return message
  }
}
