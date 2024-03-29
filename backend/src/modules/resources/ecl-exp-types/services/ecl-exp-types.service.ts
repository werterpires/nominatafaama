import { Injectable } from '@nestjs/common'
import { EclExpTypesModel } from '../model/ecl-exp-types.model'
import { CreateEclExpTypeDto } from '../dto/create-ecl-exp-type.dto'
import {
  IEclExpType,
  ICreateEclExpType,
  IUpdateEclExpType
} from '../types/types'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class EclExpTypesService {
  constructor(private eclExpTypesModel: EclExpTypesModel) {}

  async createEclExpType(
    dto: CreateEclExpTypeDto,
    currentUser: UserFromJwt
  ): Promise<IEclExpType> {
    try {
      const eclExpType: ICreateEclExpType = {
        ecl_exp_type_name: dto.ecl_exp_type_name
      }

      const newEclExpType = await this.eclExpTypesModel.createEclExpType(
        eclExpType,
        currentUser
      )
      return newEclExpType
    } catch (error) {
      throw error
    }
  }

  async findEclExpTypeById(id: number): Promise<IEclExpType> {
    try {
      const eclExpType = await this.eclExpTypesModel.findEclExpTypeById(id)
      return eclExpType as IEclExpType
    } catch (error) {
      throw new Error(
        `Failed to find ECL experience type with id ${id}: ${error.message}`
      )
    }
  }

  async findAllEclExpTypes(): Promise<IEclExpType[]> {
    try {
      const eclExpTypes = await this.eclExpTypesModel.findAllEclExpTypes()
      return eclExpTypes
    } catch (error) {
      throw error
    }
  }

  async updateEclExpTypeById(
    input: IUpdateEclExpType,
    currentUser: UserFromJwt
  ): Promise<IEclExpType> {
    let updatedEclExpType: IEclExpType | null = null
    let sentError: Error | null = null

    try {
      updatedEclExpType = await this.eclExpTypesModel.updateEclExpTypeById(
        input,
        currentUser
      )
    } catch (error) {
      sentError = new Error(error.message)
    }

    if (sentError !== null) {
      throw sentError
    }

    if (updatedEclExpType === null) {
      throw new Error('Failed to update ECL experience type.')
    }

    return updatedEclExpType
  }

  async deleteEclExpTypeById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    try {
      const message = await this.eclExpTypesModel.deleteEclExpTypeById(
        id,
        currentUser
      )
      return message
    } catch (error) {
      throw error
    }
  }
}
