import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  ILanguageType,
  ICreateLanguageType,
  IUpdateLanguageType
} from '../types/types'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class LanguageTypesModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async createLanguageType(
    { language }: ICreateLanguageType,
    currentUser: UserFromJwt
  ): Promise<ILanguageType> {
    let languageType: ILanguageType | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const [language_id] = await trx('language_types')
          .insert({
            language
          })
          .returning('language_id')

        languageType = {
          language_id: language_id,
          language,
          created_at: new Date(),
          updated_at: new Date()
        }

        await trx.commit()
        await this.notificationsService.createNotification({
          notificationType: 7,
          action: 'inseriu',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: { idioma: language },
          objectUserId: null,
          oldData: null,
          table: 'Idiomas'
        })
      } catch (error) {
        console.error(error)
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Language type already exists')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return languageType!
  }

  async findLanguageTypeById(id: number): Promise<ILanguageType | null> {
    let languageType: ILanguageType | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('language_types')
          .select('*')
          .where('language_id', '=', id)

        if (result.length < 1) {
          throw new Error('Language type not found')
        }

        languageType = {
          language_id: result[0].language_id,
          language: result[0].language,
          created_at: result[0].created_at,
          updated_at: result[0].updated_at
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

    return languageType
  }

  async findAllLanguageTypes(): Promise<ILanguageType[]> {
    let languageTypesList: ILanguageType[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx.table('language_types').select('*')

        languageTypesList = results.map((row: any) => ({
          language_id: row.language_id,
          language: row.language,
          created_at: row.created_at,
          updated_at: row.updated_at
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

    return languageTypesList
  }

  async updateLanguageTypeById(
    updateLanguageType: IUpdateLanguageType,
    currentUser: UserFromJwt
  ): Promise<ILanguageType> {
    let updatedLanguageType: ILanguageType | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { language, language_id } = updateLanguageType
        const oldData = await this.findLanguageTypeById(language_id)
        await trx('language_types')
          .where('language_id', language_id)
          .update({ language })

        updatedLanguageType = await this.findLanguageTypeById(language_id)

        await trx.commit()
        await this.notificationsService.createNotification({
          notificationType: 7,
          action: 'editou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: { idioma: language },
          objectUserId: null,
          oldData: { idioma: oldData?.language },
          table: 'Idiomas'
        })
      } catch (error) {
        console.error(error)
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    if (updatedLanguageType === null) {
      throw new Error('Failed to update language type.')
    }

    return updatedLanguageType
  }

  async deleteLanguageTypeById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        const oldData = await this.findLanguageTypeById(id)
        await trx('language_types').where('language_id', id).del()

        await trx.commit()
        await this.notificationsService.createNotification({
          notificationType: 7,
          action: 'apagou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: null,
          objectUserId: null,
          oldData: { idioma: oldData?.language },
          table: 'Idiomas'
        })
      } catch (error) {
        console.error(error)
        if (error.code == 'ER_ROW_IS_REFERENCED_2') {
          sentError = new Error(
            'Alguém está usando o idioma que você está tentando apagar.'
          )
        } else {
          sentError = new Error(error.message)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    message = 'Language type deleted successfully.'
    return message
  }
}
