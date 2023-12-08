import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import { ICreateLanguage, ILanguage, IUpdateLanguage } from '../types/types'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class LanguagesModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async createLanguage(
    createLanguageData: ICreateLanguage,
    currentUser: UserFromJwt
  ): Promise<boolean> {
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
        language_approved
      } = createLanguageData

      const [language_id] = await this.knex('languages')
        .insert({
          chosen_language,
          read,
          understand,
          speak,
          write,
          fluent,
          unknown,
          person_id,
          language_approved
        })
        .returning('language_id')

      const personUndOthers = await this.knex('people')
        .leftJoin('languages', 'people.person_id', 'languages.person_id')
        .leftJoin(
          'language_types',
          'languages.chosen_language',
          'language_types.language_id'
        )
        .where('people.person_id', person_id)
        .andWhere('language_types.language_id', chosen_language)
        .select('people.name', 'language_types.language')
        .first()

      await this.notificationsService.createNotification({
        action: 'inseriu',
        agent_name: currentUser.name,
        agentUserId: currentUser.user_id,
        newData: {
          linguagem: personUndOthers.language,
          leitura: await this.notificationsService.formateBoolean(read),
          compreensao: await this.notificationsService.formateBoolean(
            understand
          ),
          fala: await this.notificationsService.formateBoolean(speak),
          escreve: await this.notificationsService.formateBoolean(write),
          fluencia: await this.notificationsService.formateBoolean(fluent),
          pessoa: personUndOthers?.name
        },
        notificationType: 4,
        objectUserId: currentUser.user_id,
        oldData: null,
        table: 'Idiomas'
      })

      const language = await this.findLanguageById(language_id)

      return true
    } catch (error) {
      console.error(error)
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Language already exists')
      } else {
        throw new Error(error.sqlMessage)
      }
    }
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
            'language_types.language_id'
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
          language: result.language
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

    return language
  }

  async findAllNotApprovedPersonIds(): Promise<{ person_id: number }[] | null> {
    let personIds: { person_id: number }[] | null = null
    let sentError: Error | null = null

    try {
      const studentResult = await this.knex
        .table('languages')
        .join('users', 'users.person_id', 'languages.person_id')
        .select('users.person_id')
        .whereNull('language_approved')

      const spouseResult = await this.knex
        .table('languages')
        .join('spouses', 'spouses.person_id', 'languages.person_id')
        .join('students', 'students.student_id', 'spouses.student_id')
        .select('students.person_id')
        .whereNull('languages.language_approved')

      personIds = [...studentResult, ...spouseResult].map((row) => ({
        person_id: row.person_id
      }))
    } catch (error) {
      console.error('Erro capturado na model: ', error)
      sentError = new Error(error.message)
    }

    return personIds
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
            'language_types.language_id'
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
          language: row.language
        }))

        await trx.commit()
      } catch (error) {
        console.error(error)
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
            'language_types.language_id'
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
          language: row.language
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

    return languageList
  }

  async findApprovedLanguagesByPersonId(
    personId: number
  ): Promise<ILanguage[]> {
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
            'language_types.language_id'
          )
          .where('person_id', '=', personId)
          .andWhere('languages.language_approved', '=', true)

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
          language: row.language
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

    return languageList
  }

  async updateLanguageById(
    updateLanguage: IUpdateLanguage,
    currentUser: UserFromJwt
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
          language_approved
        } = updateLanguage

        let approved = await trx('languages')
          .first('*')
          .leftJoin(
            'language_types',
            'languages.chosen_language',
            'language_types.language_id'
          )
          .leftJoin('users', 'languages.person_id', 'users.person_id')
          .where('languages.language_id', language_id)

        if (approved.language_approved == true) {
          throw new Error('Registro já aprovado')
        }

        await trx('languages').where('language_id', language_id).update({
          chosen_language,
          read,
          understand,
          speak,
          write,
          fluent,
          unknown,
          person_id,
          language_approved
        })

        await trx.commit()
        let userIdAlt
        if (!approved.user_id) {
          userIdAlt = await this.knex('spouses')
            .leftJoin('students', 'spouses.student_id', 'students.student_id')
            .leftJoin('users', 'students.person_id', 'users.person_id')
            .where('spouses.person_id', person_id)
            .first('users.user_id')
        }

        const personUndOthers = await this.knex('people')
          .leftJoin('languages', 'people.person_id', 'languages.person_id')
          .leftJoin(
            'language_types',
            'languages.chosen_language',
            'language_types.language_id'
          )
          .where('people.person_id', person_id)
          .andWhere('language_types.language_id', chosen_language)
          .select('people.name', 'language_types.language')
          .first()

        await this.notificationsService.createNotification({
          action: 'editou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: {
            linguagem: personUndOthers.language,
            leitura: await this.notificationsService.formateBoolean(read),
            compreensao: await this.notificationsService.formateBoolean(
              understand
            ),
            fala: await this.notificationsService.formateBoolean(speak),
            escreve: await this.notificationsService.formateBoolean(write),
            fluencia: await this.notificationsService.formateBoolean(fluent),
            pessoa: personUndOthers?.name
          },
          notificationType: 4,
          objectUserId: approved.user_id || userIdAlt.user_id,
          oldData: {
            linguagem: personUndOthers.language,
            leitura: await this.notificationsService.formateBoolean(
              approved.read
            ),
            compreensao: await this.notificationsService.formateBoolean(
              approved.understand
            ),
            fala: await this.notificationsService.formateBoolean(
              approved.speak
            ),
            escreve: await this.notificationsService.formateBoolean(
              approved.write
            ),
            fluencia: await this.notificationsService.formateBoolean(
              approved.fluent
            ),
            pessoa: personUndOthers?.name
          },
          table: 'Idiomas'
        })

        updatedLanguage = await this.findLanguageById(language_id)
      } catch (error) {
        console.error(error)
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    return updatedLanguage!
  }

  async deleteLanguageById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        let approved = await trx('languages')
          .first('*')
          .leftJoin(
            'language_types',
            'languages.chosen_language',
            'language_types.language_id'
          )
          .leftJoin('people', 'languages.person_id', 'people.person_id')
          .where('languages.language_id', id)

        if (!approved) {
          throw new Error('Language not found')
        }

        if (approved.language_approved == true) {
          throw new Error('Registro já aprovado')
        }

        await trx('languages').where('language_id', id).del()

        await trx.commit()

        await this.notificationsService.createNotification({
          action: 'apagou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: null,
          notificationType: 4,
          objectUserId: currentUser.user_id,
          oldData: {
            linguagem: approved.language,
            leitura: await this.notificationsService.formateBoolean(
              approved.read
            ),
            compreensao: await this.notificationsService.formateBoolean(
              approved.understand
            ),
            fala: await this.notificationsService.formateBoolean(
              approved.speak
            ),
            escreve: await this.notificationsService.formateBoolean(
              approved.write
            ),
            fluencia: await this.notificationsService.formateBoolean(
              approved.fluent
            ),
            pessoa: approved?.name
          },
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

    message = 'Language deleted successfully.'
    return message
  }
}
