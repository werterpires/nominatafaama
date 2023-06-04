import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  ICreateRelatedMinistry,
  IRelatedMinistry,
  IUpdateRelatedMinistry,
} from '../types/types'

@Injectable()
export class RelatedMinistriesModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createRelatedMinistry(
    createRelatedMinistryData: ICreateRelatedMinistry,
  ): Promise<number> {
    let related_ministry_id!: number
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          person_id,
          ministry_type_id,
          priority,
          related_ministry_approved,
        } = createRelatedMinistryData

        ;[related_ministry_id] = await trx('related_ministries')
          .insert({
            person_id,
            ministry_type_id,
            priority,
            related_ministry_approved,
          })
          .returning('related_ministry_id')

        await trx.commit()
      } catch (error) {
        console.error(error)
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Related ministry already exists')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    if (!related_ministry_id) {
      throw new Error('Não foi possível criar ministério relacionado.')
    }

    return related_ministry_id
  }

  async findRelatedMinistryById(id: number): Promise<IRelatedMinistry> {
    let relatedMinistry: IRelatedMinistry | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('related_ministries')
          .first('related_ministries.*', 'ministry_types.ministry_type_name')
          .leftJoin(
            'ministry_types',
            'related_ministries.ministry_type_id',
            'ministry_types.ministry_type_id',
          )
          .where('related_ministry_id', '=', id)

        if (!result) {
          throw new Error('Related ministry not found')
        }

        relatedMinistry = {
          related_ministry_id: result.related_ministry_id,
          person_id: result.person_id,
          ministry_type_id: result.ministry_type_id,
          priority: result.priority,
          related_ministry_approved: result.related_ministry_approved,
          ministry_type_name: result.ministry_type_name,
          created_at: result.created_at,
          updated_at: result.updated_at,
        }

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

    if (relatedMinistry == null) {
      throw new Error('Related ministry not found')
    }

    return relatedMinistry
  }

  async findAllRelatedMinistries(): Promise<IRelatedMinistry[]> {
    let relatedMinistriesList: IRelatedMinistry[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('related_ministries')
          .select('related_ministries.*', 'ministry_types.ministry_type_name')
          .leftJoin(
            'ministry_types',
            'related_ministries.ministry_type_id',
            'ministry_types.ministry_type_id',
          )

        relatedMinistriesList = results.map((row: any) => ({
          related_ministry_id: row.related_ministry_id,
          person_id: row.person_id,
          ministry_type_id: row.ministry_type_id,
          priority: row.priority,
          related_ministry_approved: row.related_ministry_approved,
          ministry_type_name: row.ministry_type_name,
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

    return relatedMinistriesList
  }

  async findRelatedMinistriesByPersonId(
    personId: number,
  ): Promise<IRelatedMinistry[]> {
    let relatedMinistriesList: IRelatedMinistry[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const existingRelatedMinistries = await trx('related_ministries')
          .select('person_id')
          .where('person_id', personId)
          .first()

        if (existingRelatedMinistries) {
          const results = await trx
            .table('related_ministries')
            .select('related_ministries.*', 'ministry_types.ministry_type_name')
            .leftJoin(
              'ministry_types',
              'related_ministries.ministry_type_id',
              'ministry_types.ministry_type_id',
            )
            .where('related_ministries.person_id', '=', personId)

          relatedMinistriesList = results.map((row: any) => ({
            related_ministry_id: row.related_ministry_id,
            person_id: row.person_id,
            ministry_type_id: row.ministry_type_id,
            priority: row.priority,
            related_ministry_approved: row.related_ministry_approved,
            ministry_type_name: row.ministry_type_name,
            created_at: row.created_at,
            updated_at: row.updated_at,
          }))

          await trx.commit()
        }
      } catch (error) {
        console.error(error)
        await trx.rollback()
        sentError = new Error(error.sqlMessage)
      }
    })

    if (sentError) {
      throw sentError
    }

    return relatedMinistriesList
  }

  async updateRelatedMinistryById(
    updateRelatedMinistry: IUpdateRelatedMinistry,
  ): Promise<number> {
    let updatedRelatedMinistry: number | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          related_ministry_id,
          person_id,
          ministry_type_id,
          priority,
          related_ministry_approved,
        } = updateRelatedMinistry

        updatedRelatedMinistry = await trx('related_ministries')
          .where('related_ministry_id', related_ministry_id)
          .update({
            person_id,
            ministry_type_id,
            priority,
            related_ministry_approved,
          })

        await trx.commit()
      } catch (error) {
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    if (updatedRelatedMinistry == null) {
      throw new Error('Related ministry not found')
    }

    return updatedRelatedMinistry
  }

  async deleteRelatedMinistryById(id: number): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        const existingRelatedMinistry = await trx('related_ministries')
          .select('related_ministry_id')
          .where('related_ministry_id', id)
          .first()

        if (!existingRelatedMinistry) {
          throw new Error('Related ministry not found')
        }

        await trx('related_ministries').where('related_ministry_id', id).del()

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

    message = 'Related ministry deleted successfully'
    return message
  }
}
