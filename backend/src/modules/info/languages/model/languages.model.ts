import {Injectable} from '@nestjs/common'
import {Knex} from 'knex'
import {InjectModel} from 'nest-knexjs'
import {ICreateLanguage, ILanguage, IUpdateLanguage} from '../types/types'

@Injectable()
export class LanguagesModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createLanguage(
    createLanguageData: ICreateLanguage,
  ): Promise<ILanguage> {
    let language: ILanguage | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          chosen_language,
          read,
          understand,
          speak,
          write,
          fluent,
          unknown,
          person_id,
        } = createLanguageData

        const [result] = await trx('languages').insert({
          chosen_language,
          read,
          understand,
          speak,
          write,
          fluent,
          unknown,
          person_id,
          language_approved: false,
        })

        await trx.commit()

        language = await this.findLanguageById(result)
      } catch (error) {
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Language already exists')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return language!
  }

  async findLanguageById(id: number): Promise<ILanguage | null> {
    let language: ILanguage | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('languages')
          .first('languages.*', 'language_types.language')
          .leftJoin(
            'language_types',
            'languages.chosen_language',
            'language_types.language_id',
          )
          .where('languages.language_id', '=', id)

        if (!result) {
          throw new Error('Language not found')
        }

        language = {
          language_id: result.language_id,
          chosen_language: result.chosen_language,
          read: result.read,
          understand: result.understand,
          speak: result.speak,
          write: result.write,
          fluent: result.fluent,
          unknown: result.unknown,
          person_id: result.person_id,
          language_approved: result.language_approved,
          created_at: result.created_at,
          updated_at: result.updated_at,
          language: result.language,
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

    return language
  }

  async findAllLanguages(): Promise<ILanguage[]> {
    let languageList: ILanguage[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('languages')
          .select('languages.*', 'language_types.language')
          .leftJoin(
            'language_types',
            'languages.chosen_language',
            'language_types.language_id',
          )

        languageList = results.map((row: any) => ({
          language_id: row.language_id,
          chosen_language: row.chosen_language,
          read: row.read,
          understand: row.understand,
          speak: row.speak,
          write: row.write,
          fluent: row.fluent,
          unknown: row.unknown,
          person_id: row.person_id,
          language_approved: row.language_approved,
          created_at: row.created_at,
          updated_at: row.updated_at,
          language: row.language,
        }))

        await trx.commit()
      } catch (error) {
        sentError = new Error(error.sqlMessage)
        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    return languageList
  }

  async findLanguagesByPersonId(personId: number): Promise<ILanguage[]> {
    let languageList: ILanguage[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('languages')
          .select('languages.*', 'language_types.language')
          .leftJoin(
            'language_types',
            'languages.chosen_language',
            'language_types.language_id',
          )
          .where('person_id', '=', personId)

        languageList = results.map((row: any) => ({
          language_id: row.language_id,
          chosen_language: row.chosen_language,
          read: row.read,
          understand: row.understand,
          speak: row.speak,
          write: row.write,
          fluent: row.fluent,
          unknown: row.unknown,
          person_id: row.person_id,
          language_approved: row.language_approved,
          created_at: row.created_at,
          updated_at: row.updated_at,
          language: row.language,
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

    return languageList
  }

  async updateLanguageById(
    updateLanguage: IUpdateLanguage,
  ): Promise<ILanguage> {
    let updatedLanguage: ILanguage | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          language_id,
          chosen_language,
          read,
          understand,
          speak,
          write,
          fluent,
          unknown,
          person_id,
        } = updateLanguage

        await trx('languages').where('language_id', language_id).update({
          chosen_language,
          read,
          understand,
          speak,
          write,
          fluent,
          unknown,
          person_id,
        })

        await trx.commit()

        updatedLanguage = await this.findLanguageById(language_id)
      } catch (error) {
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    return updatedLanguage!
  }

  async deleteLanguageById(id: number): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        const existingLanguage = await trx('languages')
          .select('language_id')
          .where('language_id', id)
          .first()

        if (!existingLanguage) {
          throw new Error('Language not found')
        }

        await trx('languages').where('language_id', id).del()

        await trx.commit()
      } catch (error) {
        await trx.rollback()
        console.log(error)
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    message = 'Language deleted successfully.'
    return message
  }
}
