import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  IAssociation,
  ICreateAssociation,
  IUpdateAssociation,
} from '../types/types'

@Injectable()
export class AssociationsModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createAssociation(
    createAssociation: ICreateAssociation,
  ): Promise<IAssociation> {
    let association: IAssociation | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const [result] = await trx('associations').insert(
          createAssociation,
          '*',
          {
            includeTriggerModifications: true,
          },
        )

        await trx.commit()
      } catch (error) {
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Association Já existe')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return association!
  }

  async findAssociationById(id: number): Promise<IAssociation | null> {
    let association: IAssociation | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('associations')
          .select(
            'associations.association_name',
            'associations.association_acronym',
            'associations.association_id',
            'unions.union_name',
            'unions.union_acronym',
            'associations.union_id',
          )
          .leftJoin('unions', 'associations.union_id', 'unions.union_id')
          .where('associations.association_id', '=', id)

        if (result.length < 1) {
          throw new Error('Association not found')
        }

        association = {
          association_id: result[0].association_id,
          association_name: result[0].association_name,
          association_acronym: result[0].association_acronym,
          union_id: result[0].union_id,
          union_name: result[0].union_name,
          union_acronym: result[0].union_acronym,
          created_at: result[0].created_at,
          updated_at: result[0].updated_at,
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

    return association
  }

  async findAllAssociations(): Promise<IAssociation[]> {
    let associationList: IAssociation[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx('associations')
          .select('associations.*', 'unions.union_name', 'unions.union_acronym')
          .leftJoin('unions', 'associations.union_id', 'unions.union_id')

        associationList = results.map((row: any) => ({
          association_id: row.association_id,
          association_name: row.association_name,
          association_acronym: row.association_acronym,
          union_id: row.union_id,
          union_name: row.union_name,
          union_acronym: row.union_acronym,
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

    return associationList
  }

  async updateAssociationById(
    updateAssociation: IUpdateAssociation,
  ): Promise<IAssociation> {
    let updatedAssociation: IAssociation | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          association_name,
          association_acronym,
          association_id,
          union_id,
        } = updateAssociation

        await trx('associations')
          .where('association_id', association_id)
          .update({ association_name, association_acronym, union_id })

        updatedAssociation = await this.findAssociationById(association_id)

        await trx.commit()
      } catch (error) {
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    if (updatedAssociation === null) {
      throw new Error('Failed to update association.')
    }

    return updatedAssociation
  }

  async deleteAssociationById(id: number): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        await trx('associations').where('association_id', id).del()

        await trx.commit()
      } catch (error) {
        sentError = new Error(error.message)
        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    message = 'Association deleted successfully.'
    return message
  }
}
