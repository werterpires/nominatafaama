import { Injectable } from '@nestjs/common'
import { EvangExpTypesModel } from '../model/evang-exp-types.model'
import { CreateEvangExpTypeDto } from '../dto/create-evang-exp-type.dto'
import {
  IEvangExpType,
  ICreateEvangExpType,
  IUpdateEvangExpType
} from '../types/types'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class EvangExpTypesService {
  constructor(private evangExpTypesModel: EvangExpTypesModel) {}

  async createEvangExpType(
    dto: CreateEvangExpTypeDto,
    currentUser: UserFromJwt
  ): Promise<IEvangExpType> {
    try {
      const evangExpType: ICreateEvangExpType = {
        evang_exp_type_name: dto.evang_exp_type_name
      }

      const newEvangExpType = await this.evangExpTypesModel.createEvangExpType(
        evangExpType,
        currentUser
      )
      return newEvangExpType
    } catch (error) {
      throw error
    }
  }

  async findEvangExpTypeById(id: number): Promise<IEvangExpType> {
    try {
      const evangExpType = await this.evangExpTypesModel.findEvangExpTypeById(
        id
      )
      return evangExpType as IEvangExpType
    } catch (error) {
      throw new Error(
        `Failed to find evangelical experience type with id ${id}: ${error.message}`
      )
    }
  }

  async findAllEvangExpTypes(): Promise<IEvangExpType[]> {
    try {
      const evangExpTypes = await this.evangExpTypesModel.findAllEvangExpTypes()
      return evangExpTypes
    } catch (error) {
      throw error
    }
  }

  async updateEvangExpTypeById(
    input: IUpdateEvangExpType,
    currentUser: UserFromJwt
  ): Promise<IEvangExpType> {
    let updatedEvangExpType: IEvangExpType | null = null
    let sentError: Error | null = null

    try {
      updatedEvangExpType =
        await this.evangExpTypesModel.updateEvangExpTypeById(input, currentUser)
    } catch (error) {
      sentError = new Error(error.message)
    }

    if (sentError !== null) {
      throw sentError
    }

    if (updatedEvangExpType === null) {
      throw new Error('Failed to update evangelical experience type.')
    }

    return updatedEvangExpType
  }

  async deleteEvangExpTypeById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    try {
      const message = await this.evangExpTypesModel.deleteEvangExpTypeById(
        id,
        currentUser
      )
      return message
    } catch (error) {
      throw error
    }
  }
}
