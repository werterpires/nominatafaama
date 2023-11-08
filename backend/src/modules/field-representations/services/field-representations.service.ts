import { Injectable } from '@nestjs/common'
import { CreateFieldRepresentationDto } from '../dto/create-field-representation.dto'
import {
  EvaluateFieldRepresentationDto,
  UpdateFieldRepresentationDto
} from '../dto/update-field-representation.dto'
import { UserFromJwt } from 'src/shared/auth/types/types'
import {
  ICreateFieldRepresentation,
  IEvaluateFieldRepresentation,
  IFieldRepresentation,
  IUpdateFieldRepresentation
} from '../types/types'
import { FieldRepresentationsModel } from '../model/field-representations.model'
import { FieldRepsModel } from 'src/modules/field-reps/model/field-reps.model'

@Injectable()
export class FieldRepresentationsService {
  constructor(
    private fieldRepresentationsModel: FieldRepresentationsModel,
    private fieldRepsModel: FieldRepsModel
  ) {}
  async createFieldRepresentation(
    dto: CreateFieldRepresentationDto,
    currentUser: UserFromJwt
  ): Promise<IFieldRepresentation> {
    try {
      const rep = await this.fieldRepsModel.findFieldRepByUserId(
        currentUser.user_id
      )

      if (!rep) {
        throw new Error('Nenhum Representante foi encontrado.')
      }

      const createRepresentationData: ICreateFieldRepresentation = {
        repID: rep.repId,
        representedFieldID: dto.representedFieldID,
        functionn: dto.functionn,
        repApproved: null,
        repActiveValidate: new Date()
      }

      const newFieldRep =
        await this.fieldRepresentationsModel.createFieldRresentation(
          createRepresentationData,
          currentUser
        )
      return newFieldRep
    } catch (error) {
      throw error
    }
  }

  async findFieldRepresentationsByUserIdToEdit(
    currentUser: UserFromJwt
  ): Promise<IFieldRepresentation[]> {
    try {
      const fieldRepresentations =
        await this.fieldRepresentationsModel.findFieldRepresentationsByUserId(
          currentUser.user_id
        )
      if (fieldRepresentations === null) {
        throw new Error('Representações de campo não encontradas')
      }
      return fieldRepresentations
    } catch (error) {
      console.error(error)
      return null as any
    }
  }

  async findFieldRepresentationsById(
    representationId: number
  ): Promise<IFieldRepresentation> {
    try {
      const fieldRepresentation =
        await this.fieldRepresentationsModel.findFieldRepresentationById(
          representationId
        )
      if (fieldRepresentation === null) {
        throw new Error('Representação de campo não encontrada')
      }
      return fieldRepresentation
    } catch (error) {
      console.error(error)
      return null as any
    }
  }

  async findNotRatedFieldRepresentations(): Promise<IFieldRepresentation[]> {
    try {
      const fieldRepresentations =
        await this.fieldRepresentationsModel.findNotRatedFieldRepresentations()
      if (fieldRepresentations === null) {
        throw new Error('Representações de campo não encontradas')
      }
      return fieldRepresentations
    } catch (error) {
      console.error(error)
      return null as any
    }
  }

  async findFieldRepresentationsByRepId(
    repId: number
  ): Promise<IFieldRepresentation[]> {
    try {
      const fieldRepresentations =
        await this.fieldRepresentationsModel.findFieldRepresentationsByRepId(
          repId
        )
      if (fieldRepresentations === null) {
        throw new Error('Representações de campo não encontradas')
      }
      return fieldRepresentations
    } catch (error) {
      console.error(error)
      return null as any
    }
  }

  async updateFieldRepresentationById(
    updateDTO: UpdateFieldRepresentationDto,
    currentUser: UserFromJwt
  ): Promise<IFieldRepresentation> {
    let updatedFieldRepresentation: IFieldRepresentation | null = null
    let sentError: Error | null = null

    try {
      const updateData: IUpdateFieldRepresentation = {
        ...updateDTO,
        repApproved: null,
        repActiveValidate: new Date()
      }
      updatedFieldRepresentation =
        await this.fieldRepresentationsModel.updateFieldRepresentationById(
          updateData,
          currentUser
        )
    } catch (error) {
      sentError = new Error(error.message)
    }

    if (sentError !== null) {
      throw sentError
    }

    if (!updatedFieldRepresentation) {
      throw new Error('Failed to update field rep')
    }

    return updatedFieldRepresentation
  }

  async evaluateFieldRepresentationById(
    evaluateDTO: EvaluateFieldRepresentationDto,
    currentUser: UserFromJwt
  ): Promise<IFieldRepresentation> {
    let updatedFieldRepresentation: IFieldRepresentation | null = null
    let sentError: Error | null = null

    try {
      const evaluateData: IEvaluateFieldRepresentation = {
        ...evaluateDTO,
        repActiveValidate: new Date(evaluateDTO.repActiveValidate)
      }
      updatedFieldRepresentation =
        await this.fieldRepresentationsModel.evaluateFieldRepresentation(
          evaluateData,
          currentUser
        )
    } catch (error) {
      sentError = new Error(error.message)
    }

    if (sentError !== null) {
      throw sentError
    }

    if (!updatedFieldRepresentation) {
      throw new Error('Failed to update field rep')
    }

    return updatedFieldRepresentation
  }

  async deleteFieldRepresentationById(
    fieldRepresentationId: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    try {
      const message =
        await this.fieldRepresentationsModel.deleteFieldRepresentationById(
          fieldRepresentationId,
          currentUser
        )
      return message
    } catch (error) {
      throw error
    }
  }
}
