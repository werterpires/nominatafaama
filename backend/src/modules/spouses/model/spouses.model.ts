import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import { ICreateSpouse, ISpouse, IUpdateSpouse } from '../types/types'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class SpousesModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async createSpouse(
    createSpouse: ICreateSpouse,
    currentUser: UserFromJwt
  ): Promise<void> {
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { cpf, name, ...spouseData } = createSpouse
        const [person_id] = await trx('people')
          .insert({
            name: name,
            cpf: cpf
          })
          .returning('person_id')

        await trx('spouses')
          .insert({
            ...spouseData,
            person_id: person_id,
            spouse_approved: null
          })
          .returning('spouse_id')

        await trx.commit()

        await this.notificationsService.createNotification({
          action: 'inseriu',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: {
            pessoa: name
          },
          notificationType: 4,
          objectUserId: currentUser.user_id,
          oldData: null,
          table: 'Cônjuges'
        })
      } catch (error) {
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Estudante já existe')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }
  }

  async findSpouseById(id: number): Promise<ISpouse | null> {
    let spouse: ISpouse | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('spouses')
          .first(
            'spouses.*',
            'associations.*',
            'unions.*',
            'people.name as person_name',
            'people.person_id as person_id',
            'people.cpf as person_cpf'
          )
          .leftJoin('users', 'spouses.person_id', 'users.person_id')
          .leftJoin('people', 'spouses.person_id', 'people.person_id')
          .leftJoin(
            'associations',
            'spouses.origin_field_id',
            'associations.association_id'
          )
          .leftJoin('unions', 'associations.union_id', 'unions.union_id')
          .where('spouses.spouse_id', '=', id)

        if (result.length < 1) {
          throw new Error('Cônjuge não encontrado')
        }

        spouse = {
          spouse_id: result.spouse_id,
          phone_number: result.phone_number,
          is_whatsapp: result.is_whatsapp,
          alternative_email: result.alternative_email,
          person_id: result.person_id,
          origin_field_id: result.origin_field_id,
          justification: result.justification,
          birth_city: result.birth_city,
          birth_state: result.birth_state,
          primary_school_city: result.primary_school_city,
          birth_date: result.birth_date,
          baptism_date: result.baptism_date,
          baptism_place: result.baptism_place,
          spouse_approved: result.spouse_approved,
          primary_school_state: result.primary_school_state,
          created_at: result.created_at,
          updated_at: result.updated_at,
          name: result.name,
          association_name: result.association_name,
          association_acronym: result.association_acronym,
          union_name: result.union_name,
          union_acronym: result.union_acronym,
          union_id: result.union_id,
          civil_marriage_date: result.civil_marriage_date,
          civil_marriage_city: result.civil_marriage_city,
          registry: result.registry,
          registry_number: result.registry_number,
          student_id: result.student_id,
          civil_marriage_state: result.civil_marriage_state
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

    return spouse
  }

  async findNotApprovedStudentIds(): Promise<{ person_id: number }[] | null> {
    let personIds: { person_id: number }[] | null = null
    let sentError: Error | null = null

    try {
      const result = await this.knex
        .table('spouses')
        .select('students.person_id')
        .innerJoin('students', 'spouses.student_id', 'students.student_id')
        .whereNull('spouses.spouse_approved')

      if (result) {
        personIds = result.map((row) => ({ person_id: row.person_id }))
      }
    } catch (error) {
      console.error('Erro capturado na model: ', error)
      sentError = new Error(error.message)
    }

    return personIds
  }

  async findSpouseByUserId(userId: number): Promise<ISpouse | null> {
    let spouse: ISpouse | null = null
    let sentError: Error | null = null

    try {
      const result = await this.knex('spouses')
        .first(
          'spouses.*',
          'associations.*',
          'unions.*',
          'people.name as person_name',
          'people.person_id as person_id',
          'people.cpf as person_cpf'
        )
        .leftJoin('students', 'spouses.student_id', 'students.student_id')
        .leftJoin('users', 'students.person_id', 'users.person_id')
        .leftJoin('people', 'spouses.person_id', 'people.person_id')
        .leftJoin(
          'associations',
          'spouses.origin_field_id',
          'associations.association_id'
        )
        .leftJoin('unions', 'associations.union_id', 'unions.union_id')
        .where('users.user_id', '=', userId)

      if (result == undefined) {
        spouse = null
      } else {
        spouse = result
      }
    } catch (error) {
      console.error(
        'Erro capturado no SpousesModel findSpouseByUserId: ',
        error
      )
      sentError = new Error(error.message)
    }
    if (sentError) {
      throw sentError
    }

    return spouse
  }

  async findApprovedSpouseByStudentId(
    studentId: number
  ): Promise<ISpouse | null> {
    let spouse: ISpouse | null = null
    let sentError: Error | null = null

    try {
      const result = await this.knex('spouses')
        .first(
          'spouses.*',
          'associations.*',
          'unions.*',
          'people.name as person_name',
          'people.person_id as person_id',
          'people.cpf as person_cpf'
        )
        .leftJoin('students', 'spouses.student_id', 'students.student_id')
        .leftJoin('users', 'students.person_id', 'users.person_id')
        .leftJoin('people', 'spouses.person_id', 'people.person_id')
        .leftJoin(
          'associations',
          'spouses.origin_field_id',
          'associations.association_id'
        )
        .leftJoin('unions', 'associations.union_id', 'unions.union_id')
        .where('spouses.student_id', '=', studentId)
        .andWhere('spouses.spouse_approved', '=', true)

      if (result == undefined) {
        spouse = null
      } else {
        spouse = result
      }
    } catch (error) {
      console.error(
        'Erro capturado no SpousesModel findSpouseByUserId: ',
        error
      )
      sentError = new Error(error.message)
    }
    if (sentError) {
      throw sentError
    }

    return spouse
  }

  async findAllSpouses(): Promise<ISpouse[]> {
    let spouseList: ISpouse[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx('spouses')
          .select(
            'spouses.spouse_id',
            'spouses.phone_number',
            'spouses.is_whatsapp',
            'spouses.alternative_email',
            'spouses.spouse_mensage',
            'spouses.person_id',
            'spouses.origin_field_id',
            'spouses.justification',
            'spouses.birth_city',
            'spouses.birth_state',
            'spouses.primary_school_city',
            'spouses.birth_date',
            'spouses.baptism_date',
            'spouses.baptism_place',
            'spouses.spouse_approved',
            'spouses.spouse_active',
            'spouses.created_at',
            'spouses.updated_at',
            'people.name' // Adiciona a coluna 'name' da tabela 'people'
          )
          .leftJoin('people', 'spouses.person_id', 'people.person_id') // Faz o left join com a tabela 'people'

        spouseList = results.map((row: any) => ({
          spouse_id: row.spouse_id,
          phone_number: row.phone_number,
          is_whatsapp: row.is_whatsapp,
          alternative_email: row.alternative_email,
          spouse_mensage: row.spouse_mensage,
          person_id: row.person_id,
          origin_field_id: row.origin_field_id,
          justification: row.justification,
          birth_city: row.birth_city,
          birth_state: row.birth_state,
          primary_school_city: row.primary_school_city,
          birth_date: row.birth_date,
          baptism_date: row.baptism_date,
          baptism_place: row.baptism_place,
          spouse_approved: row.spouse_approved,
          spouse_active: row.spouse_active,
          primary_school_state: row.primary_school_state,
          created_at: row.created_at,
          updated_at: row.updated_at,
          name: row.name,
          association_name: row.association_name,
          association_acronym: row.association_acronym,
          union_name: row.union_name,
          union_acronym: row.union_acronym,
          union_id: row.union_id,
          civil_marriage_date: row.civil_marriage_date,
          civil_marriage_city: row.civil_marriage_city,
          registry: row.registry,
          registry_number: row.registry_number,
          student_id: row.student_id,
          civil_marriage_state: row.civil_marriage_state
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

    return spouseList
  }

  async updateSpouseById(
    updateSpouse: IUpdateSpouse,
    currentUser: UserFromJwt
  ): Promise<ISpouse> {
    let updatedSpouse: ISpouse | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          spouse_id,
          phone_number,
          is_whatsapp,
          alternative_email,
          person_id,
          name,
          cpf,
          origin_field_id,
          justification,
          birth_city,
          birth_state,
          primary_school_city,
          birth_date,
          baptism_date,
          baptism_place,
          civil_marriage_date,
          civil_marriage_city,
          registry,
          registry_number,
          spouse_approved,
          primary_school_state,
          civil_marriage_state
        } = updateSpouse

        let approved = await trx('spouses')
          .leftJoin('people', 'spouses.person_id', 'people.person_id')
          .leftJoin('students', 'spouses.student_id', 'students.student_id')
          .leftJoin('users', 'students.person_id', 'users.person_id')
          .where('spouse_id', spouse_id)
          .select('spouses.*', 'people.*', 'users.*')
          .first()

        if (approved.spouse_approved === true) {
          throw new Error('Cônjuge já aprovado')
        }

        await trx('spouses')
          .update({
            phone_number,
            is_whatsapp,
            alternative_email,
            person_id,
            origin_field_id,
            justification,
            birth_city,
            birth_state,
            primary_school_city,
            birth_date,
            baptism_date,
            baptism_place,
            civil_marriage_date,
            civil_marriage_city,
            registry,
            registry_number,
            spouse_approved,
            primary_school_state,
            civil_marriage_state
          })
          .where({ spouse_id })

        await trx('people').update({ cpf, name }).where({ person_id })

        updatedSpouse = await this.findSpouseById(spouse_id)

        await trx.commit()

        await this.notificationsService.createNotification({
          action: 'editou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: {
            pessoa: 'conferir na página de cônjuges do estudante'
          },
          notificationType: 4,
          objectUserId: approved.user_id,
          oldData: {
            pessoa: name
          },
          table: 'Cônjuges'
        })
      } catch (error) {
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    if (updatedSpouse === null) {
      throw new Error('Falha ao atualizar cônjuge.')
    }

    return updatedSpouse
  }

  async deleteSpouseById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      let approved = await trx('spouses')
        .leftJoin('people', 'spouses.person_id', 'people.person_id')
        .where('spouse_id', id)
        .select('spouse_approved')
        .first()

      if (approved.spouse_approved === true) {
        throw new Error('Cônjuge já aprovado')
      }
      try {
        await trx('spouses').where('spouse_id', id).del()

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

    message = 'Cônjuge excluído com sucesso.'
    return message
  }
}
