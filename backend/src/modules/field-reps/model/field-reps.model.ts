import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'

import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { ICreateFieldRep, IFieldRep, IUpdateFieldRep } from '../types/types'

@Injectable()
export class FieldRepsModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async createFieldRep(
    createFieldRep: ICreateFieldRep,
    currentUser: UserFromJwt
  ): Promise<IFieldRep> {
    let fieldRep: IFieldRep | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const [fieldRepId] = await trx('field_reps')
          .insert({
            person_id: createFieldRep.personId,
            phone_number: createFieldRep.phoneNumber
          })
          .returning('fieldRep_id')

        await trx.commit()

        fieldRep = await this.findFieldRepById(fieldRepId)

        this.notificationsService.createNotification({
          notificationType: 9,
          action: 'inseriu',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: {
            pessoa: fieldRep?.personName,
            telefone: fieldRep?.phoneNumber
          },
          oldData: null,
          objectUserId: currentUser.user_id,
          table: null
        })
      } catch (error) {
        console.error(error)
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('FieldRep já existe')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return fieldRep!
  }

  async findFieldRepById(repId: number): Promise<IFieldRep | null> {
    const result = await this.knex
      .table('field_reps')
      .first(
        'field_reps.*',
        'people.name as person_name',
        'people.person_id as person_id'
      )
      .leftJoin('people', 'field_reps.person_id', 'people.person_id')
      .where('field_reps.rep_id', '=', repId)

    if (!result) {
      throw new Error('FieldRep não encontrado')
    }

    return result
  }

  // async findFieldRepByUserId(userId: number): Promise<IFieldRep | null> {
  //   let fieldRep: IFieldRep | null = null
  //   let sentError: Error | null = null
  //   try {
  //     const result = await this.knex
  //       .table('fieldReps')
  //       .first(
  //         'fieldReps.*',
  //         'people.name as person_name',
  //         'people.person_id as person_id'
  //       )
  //       .leftJoin('users', 'fieldReps.person_id', 'users.person_id')
  //       .leftJoin('people', 'fieldReps.person_id', 'people.person_id')
  //       .where('users.user_id', userId)

  //     if (result != null) {
  //       fieldRep = result
  //     }
  //   } catch (error) {
  //     console.error('Esse é o erro capturado na model: ', error)
  //     sentError = new Error(error.message)
  //   }

  //   if (sentError) {
  //     throw sentError
  //   }

  //   return fieldRep
  // }

  async updateFieldRepById(
    updateFieldRep: IUpdateFieldRep,
    currentUser: UserFromJwt
  ): Promise<IFieldRep> {
    let updatedFieldRep: IFieldRep | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { phoneNumber, repId } = updateFieldRep

        const oldData = await this.findFieldRepById(repId)

        await trx('field_reps').where('rep_id', repId).limit(1).update({
          phone_number: phoneNumber
        })

        await trx.commit()

        this.notificationsService.createNotification({
          notificationType: 9,
          action: 'editou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: {
            pessoa: oldData?.personName,
            telefone: updateFieldRep.phoneNumber
          },
          oldData: {
            nome: oldData?.personName,
            telefone: oldData?.phoneNumber
          },
          objectUserId: currentUser.user_id,
          table: null
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

    updatedFieldRep = await this.findFieldRepById(updateFieldRep.repId)
    if (updatedFieldRep === null) {
      throw new Error('Falha ao atualizar fieldRep.')
    }

    return updatedFieldRep
  }

  async deleteFieldRepById(
    repId: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        const oldData = await this.findFieldRepById(repId)
        await trx('field_reps').where('rep_id', repId).del()

        await trx.commit()

        this.notificationsService.createNotification({
          notificationType: 9,
          action: 'apagou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: null,
          oldData: {
            nome: oldData?.personName,
            telefone: oldData?.phoneNumber
          },
          objectUserId: currentUser.user_id,
          table: null
        })
      } catch (error) {
        console.error(error)
        sentError = new Error(error.message)
        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    message = 'Representante de campo excluído com sucesso.'
    return message
  }
}
