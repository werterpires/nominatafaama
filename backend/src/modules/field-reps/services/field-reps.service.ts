import { Injectable } from '@nestjs/common'
import { CreateFieldRepDto } from '../dto/create-field-rep.dto'
import { UpdateFieldRepDto } from '../dto/update-field-rep.dto'
import { FieldRepsModel } from '../model/field-reps.model'
import { PeopleServices } from 'src/modules/people/dz_services/people.service'
import { UsersService } from 'src/modules/users/dz_services/users.service'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { ICreateFieldRep, IFieldRep, IUpdateFieldRep } from '../types/types'

@Injectable()
export class FieldRepsService {
  constructor(
    private fieldRepsModel: FieldRepsModel,
    private peopleService: PeopleServices,
    private usersService: UsersService
  ) {}

  async createFieldRep(
    dto: CreateFieldRepDto,
    currentUser: UserFromJwt
  ): Promise<IFieldRep> {
    try {
      const personId = (
        await this.usersService.findUserById(currentUser.user_id)
      )?.person_id
      if (personId == null) {
        throw new Error('Nenhum Usuário válido foi encontrado.')
      }

      const fieldRep: ICreateFieldRep = {
        personId: personId,
        phoneNumber: dto.phoneNumber
      }

      const newFieldRep = await this.fieldRepsModel.createFieldRep(
        fieldRep,
        currentUser
      )
      return newFieldRep
    } catch (error) {
      throw error
    }
  }

  async findFieldRepByIdToEdit(id: number): Promise<IFieldRep> {
    try {
      const fieldRep = await this.fieldRepsModel.findFieldRepByUserId(id)
      return fieldRep as IFieldRep
    } catch (error) {
      console.error(error)
      return null as any
    }
  }

  async findAllFieldRep(): Promise<IFieldRep[] | null> {
    try {
      const fieldRep = await this.fieldRepsModel.findAllFieldReps()
      return fieldRep
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async updateFieldRepById(
    input: UpdateFieldRepDto,
    currentUser: UserFromJwt
  ): Promise<IFieldRep> {
    let updatedFieldRep: IFieldRep | null = null
    let sentError: Error | null = null

    const updateData: IUpdateFieldRep = {
      ...input
    }

    try {
      updatedFieldRep = await this.fieldRepsModel.updateFieldRepById(
        updateData,
        currentUser
      )
    } catch (error) {
      sentError = new Error(error.message)
    }

    if (sentError !== null) {
      throw sentError
    }

    if (updatedFieldRep === null) {
      throw new Error('Failed to update field rep')
    }
    if (updatedFieldRep) {
      return updatedFieldRep
    }
    throw new Error('Não foi possível atualizar o field rep')
  }

  async deleteFieldRepById(
    fieldRepId: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    try {
      const message = await this.fieldRepsModel.deleteFieldRepById(
        fieldRepId,
        currentUser
      )
      return message
    } catch (error) {
      throw error
    }
  }
}
