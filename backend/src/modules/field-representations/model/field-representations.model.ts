import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'

import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'
import {
  ICreateFieldRepresentation,
  IEvaluateFieldRepresentation,
  IFieldRepresentation,
  IUpdateFieldRepresentation
} from '../types/types'

@Injectable()
export class FieldRepresentationsModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async createFieldRresentation(
    createFieldRepresentation: ICreateFieldRepresentation,
    currentUser: UserFromJwt
  ): Promise<IFieldRepresentation> {
    let fieldRepresentation: IFieldRepresentation | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const [fieldRepresentationId] = await trx('field_representations')
          .insert({
            rep_id: createFieldRepresentation.repID,
            represented_field_id: createFieldRepresentation.representedFieldID,
            function: createFieldRepresentation.functionn,
            rep_approved: createFieldRepresentation.repApproved,
            rep_active_validate: createFieldRepresentation.repActiveValidate
          })
          .returning('fieldRep_id')

        await trx.commit()

        fieldRepresentation = await this.findFieldRepresentationById(
          fieldRepresentationId
        )

        this.notificationsService.createNotification({
          notificationType: 10,
          action: 'inseriu',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: {
            pessoa: fieldRepresentation?.rep.personName,
            campo: fieldRepresentation?.representedField,
            função: fieldRepresentation?.functionn
          },
          oldData: null,
          objectUserId: currentUser.user_id,
          table: 'Representações de campo'
        })
      } catch (error) {
        console.error(error)
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('FieldR já existe')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return fieldRepresentation!
  }

  async findFieldRepresentationById(
    representationID: number
  ): Promise<IFieldRepresentation | null> {
    const result = await this.knex
      .table('field_representations')
      .first(
        'field_representations.*',
        'people.name as person_name',
        'people.person_id as person_id',
        'associations.association_name'
      )
      .leftJoin(
        'field_reps',
        'field_representations.rep_id',
        'field_reps.rep_id'
      )
      .leftJoin('people', 'field_reps.person_id', 'people.person_id')
      .leftJoin(
        'associations',
        'field_representations.represented_field_id',
        'associations.association_id'
      )
      .where('field_representations.representation_id', '=', representationID)

    if (!result) {
      throw new Error('Representação de campo não encontrada')
    }

    const representation: IFieldRepresentation = {
      representationID: result.representation_id,
      rep: {
        repId: result.rep_id,
        personName: result.person_name,
        phoneNumber: result.phone_number,
        personId: result.person_id
      },
      representedField: result.association_name,
      representedFieldID: result.represented_field_id,
      functionn: result.function,
      repApproved: result.rep_approved,
      repActiveValidate: result.rep_active_validate
    }

    return representation
  }

  async findFieldRepresentationsByUserId(
    userId: number
  ): Promise<IFieldRepresentation[]> {
    let fieldRepresentations: IFieldRepresentation[] | null = null
    let sentError: Error | null = null
    try {
      const result = await this.knex
        .table('field_representations')
        .select(
          'field_representations.*',
          'people.name as person_name',
          'people.person_id as person_id',
          'associations.association_name'
        )
        .leftJoin(
          'field_reps',
          'field_representations.rep_id',
          'field_reps.rep_id'
        )
        .leftJoin('people', 'field_reps.person_id', 'people.person_id')
        .leftJoin('users', 'people.person_id', 'users.person_id')
        .leftJoin(
          'associations',
          'field_representations.represented_field_id',
          'associations.association_id'
        )
        .where('users.user_id', userId)

      if (result.length === 0) {
        fieldRepresentations = []
      } else {
        fieldRepresentations = result.reduce(
          (acc: IFieldRepresentation[], cur: any) => {
            return [
              ...acc,
              {
                representationID: cur.representation_id,
                rep: {
                  repId: cur.rep_id,
                  personName: cur.person_name,
                  phoneNumber: cur.phone_number,
                  personId: cur.person_id
                },
                representedField: cur.association_name,
                representedFieldID: cur.represented_field_id,
                functionn: cur.function,
                repApproved: cur.rep_approved,
                repActiveValidate: cur.rep_active_validate
              }
            ]
          },
          []
        )
      }
    } catch (error) {
      console.error('Esse é o erro capturado na model: ', error)
      sentError = new Error(error.message)
    }

    if (sentError) {
      throw sentError
    }

    return fieldRepresentations!
  }

  async findNotRatedFieldRepresentations(): Promise<
    IFieldRepresentation[] | null
  > {
    let fieldRepresentations: IFieldRepresentation[] | null = null
    let sentError: Error | null = null
    try {
      const result = await this.knex
        .table('field_representations')
        .select(
          'field_representations.*',
          'people.name as person_name',
          'people.person_id as person_id',
          'associations.association_name'
        )
        .leftJoin(
          'field_reps',
          'field_representations.rep_id',
          'field_reps.rep_id'
        )
        .leftJoin('people', 'field_reps.person_id', 'people.person_id')
        .leftJoin('users', 'people.person_id', 'users.person_id')
        .leftJoin(
          'associations',
          'field_representations.represented_field_id',
          'associations.association_id'
        )
        .where('field_representations.rep_approved', null)

      if (result === null) {
        throw new Error('Representações de campo não encontradas')
      }
      if (result.length === 0) {
        fieldRepresentations = []
      } else {
        fieldRepresentations = result.reduce(
          (acc: IFieldRepresentation[], cur: any) => {
            return [
              ...acc,
              {
                representationID: cur.representation_id,
                rep: {
                  repId: cur.rep_id,
                  personName: cur.person_name,
                  phoneNumber: cur.phone_number,
                  personId: cur.person_id
                },
                representedField: cur.association_name,
                representedFieldID: cur.represented_field_id,
                functionn: cur.function,
                repApproved: cur.rep_approved,
                repActiveValidate: cur.rep_active_validate
              }
            ]
          },
          []
        )
      }
    } catch (error) {
      console.error('Esse é o erro capturado na model: ', error)
      sentError = new Error(error.message)
    }

    if (sentError) {
      throw sentError
    }

    return fieldRepresentations!
  }

  async findFieldRepresentationsByRepId(
    repId: number
  ): Promise<IFieldRepresentation[] | null> {
    let fieldRepresentations: IFieldRepresentation[] | null = null
    let sentError: Error | null = null
    try {
      const result = await this.knex
        .table('field_representations')
        .select(
          'field_representations.*',
          'people.name as person_name',
          'people.person_id as person_id',
          'associations.association_name'
        )
        .leftJoin(
          'field_reps',
          'field_representations.rep_id',
          'field_reps.rep_id'
        )
        .leftJoin('people', 'field_reps.person_id', 'people.person_id')
        .leftJoin('users', 'people.person_id', 'users.person_id')
        .leftJoin(
          'associations',
          'field_representations.represented_field_id',
          'associations.association_id'
        )
        .where('field_representations.rep_id', repId)

      if (result === null) {
        throw new Error('Representações de campo não encontradas')
      }
      if (result.length === 0) {
        fieldRepresentations = []
      } else {
        fieldRepresentations = result.reduce(
          (acc: IFieldRepresentation[], cur: any) => {
            return [
              ...acc,
              {
                representationID: cur.representation_id,
                rep: {
                  repId: cur.rep_id,
                  personName: cur.person_name,
                  phoneNumber: cur.phone_number,
                  personId: cur.person_id
                },
                representedField: cur.association_name,
                representedFieldID: cur.represented_field_id,
                functionn: cur.function,
                repApproved: cur.rep_approved,
                repActiveValidate: cur.rep_active_validate
              }
            ]
          },
          []
        )
      }
    } catch (error) {
      console.error('Esse é o erro capturado na model: ', error)
      sentError = new Error(error.message)
    }

    if (sentError) {
      throw sentError
    }

    return fieldRepresentations!
  }

  async updateFieldRepresentationById(
    updateFieldRepresentation: IUpdateFieldRepresentation,
    currentUser: UserFromJwt
  ): Promise<IFieldRepresentation> {
    let updatedFieldRepresentation: IFieldRepresentation | null = null
    let sentError: Error | null = null

    try {
      const {
        repActiveValidate,
        functionn,
        repApproved,
        representationID,
        representedFieldID
      } = updateFieldRepresentation

      const oldData = await this.findFieldRepresentationById(representationID)

      await this.knex('field_representations')
        .where('representation_id', representationID)
        .limit(1)
        .update({
          represented_field_id: representedFieldID,
          function: functionn,
          rep_active_validate: repActiveValidate,
          rep_approved: repApproved
        })

      const newData = await this.findFieldRepresentationById(representationID)
      updatedFieldRepresentation = newData!
      this.notificationsService.createNotification({
        notificationType: 10,
        action: 'editou',
        agent_name: currentUser.name,
        agentUserId: currentUser.user_id,
        newData: {
          campo: newData?.representedField,
          funcao: newData?.functionn,
          validade: newData?.repActiveValidate,
          aprovado: newData?.repApproved
        },
        oldData: {
          campo: oldData?.representedField,
          funcao: oldData?.functionn,
          validade: oldData?.repActiveValidate,
          aprovado: oldData?.repApproved
        },
        objectUserId: currentUser.user_id,
        table: 'Representações de campo'
      })
    } catch (error) {
      console.error(error)

      sentError = new Error(error.message)
    }

    if (sentError) {
      throw sentError
    }

    if (updatedFieldRepresentation === null) {
      throw new Error('Representação de campo não encontrada')
    }

    return updatedFieldRepresentation
  }

  async evaluateFieldRepresentation(
    evaluateFieldRepresentation: IEvaluateFieldRepresentation,
    currentUser: UserFromJwt
  ): Promise<IFieldRepresentation> {
    let evaluatedFieldRepresentation: IFieldRepresentation | null = null
    let sentError: Error | null = null

    try {
      const { repActiveValidate, repApproved, representationID } =
        evaluateFieldRepresentation

      const oldData = await this.findFieldRepresentationById(representationID)
      this.knex.transaction(async (trx) => {
        if (evaluateFieldRepresentation.repApproved) {
          await trx('field_representations')
            .where('rep_id', oldData?.rep.repId)
            .update({
              rep_approved: false
            })
        }
        await trx('field_representations')
          .where('representation_id', representationID)
          .limit(1)
          .update({
            rep_active_validate: repActiveValidate,
            rep_approved: repApproved
          })
      })

      const newData = await this.findFieldRepresentationById(representationID)
      evaluatedFieldRepresentation = newData!
      this.notificationsService.createNotification({
        notificationType: 11,
        action: evaluateFieldRepresentation.repApproved
          ? 'aprovou'
          : 'desaprovou',
        agent_name: currentUser.name,
        agentUserId: currentUser.user_id,
        newData: {
          campo: newData?.representedField,
          funcao: newData?.functionn,
          validade: newData?.repActiveValidate,
          aprovado: newData?.repApproved
        },
        oldData: {
          campo: oldData?.representedField,
          funcao: oldData?.functionn,
          validade: oldData?.repActiveValidate,
          aprovado: oldData?.repApproved
        },
        objectUserId: currentUser.user_id,
        table: 'Representações de campo'
      })
    } catch (error) {
      console.error(error)

      sentError = new Error(error.message)
    }

    if (sentError) {
      throw sentError
    }

    if (evaluatedFieldRepresentation === null) {
      throw new Error('Falha ao atualizar fieldRep.')
    }

    return evaluatedFieldRepresentation
  }

  async deleteFieldRepresentationById(
    representationID: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        const oldData = await this.findFieldRepresentationById(representationID)
        await trx('field_representations')
          .where('representation_id', representationID)
          .del()

        await trx.commit()

        this.notificationsService.createNotification({
          notificationType: 10,
          action: 'apagou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: null,
          oldData: {
            campo: oldData?.representedField,
            funcao: oldData?.functionn,
            validade: oldData?.repActiveValidate,
            aprovado: oldData?.repApproved
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

    message = 'Representação de campo excluída com sucesso.'
    return message
  }
}
