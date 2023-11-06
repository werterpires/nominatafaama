import { Injectable } from '@nestjs/common'
import { MinistryTypesModel } from '../model/ministry-types.model'
import { CreateMinistryTypeDto } from '../dto/create-ministry-type.dto'
import {
  IMinistryType,
  ICreateMinistryType,
  IUpdateMinistryType
} from '../types/types'
import { UpdateMinistryTypeDto } from '../dto/update-ministry-type.dto'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class MinistryTypesService {
  constructor(private ministryTypesModel: MinistryTypesModel) {}

  async createMinistryType(
    dto: CreateMinistryTypeDto,
    currentUser: UserFromJwt
  ): Promise<IMinistryType> {
    try {
      const ministryType: ICreateMinistryType = {
        ministry_type_name: dto.ministry_type_name,
        ministry_type_approved: true
      }

      const newMinistryType = await this.ministryTypesModel.createMinistryType(
        ministryType,
        currentUser
      )
      return newMinistryType
    } catch (error) {
      throw error
    }
  }

  async findMinistryTypeById(id: number): Promise<IMinistryType> {
    try {
      const ministryType = await this.ministryTypesModel.findMinistryTypeById(
        id
      )
      return ministryType as IMinistryType
    } catch (error) {
      throw new Error(
        `Failed to find ministry type with id ${id}: ${error.message}`
      )
    }
  }

  async findAllMinistryTypes(): Promise<IMinistryType[]> {
    try {
      const ministryTypes = await this.ministryTypesModel.findAllMinistryTypes()
      return ministryTypes
    } catch (error) {
      throw error
    }
  }

  async updateMinistryTypeById(
    input: UpdateMinistryTypeDto,
    currentUser: UserFromJwt
  ): Promise<IMinistryType> {
    let updatedMinistryType: IMinistryType | null = null
    let sentError: Error | null = null
    const editDAta: IUpdateMinistryType = {
      ...input,
      ministry_type_approved: false
    }
    try {
      updatedMinistryType =
        await this.ministryTypesModel.updateMinistryTypeById(
          editDAta,
          currentUser
        )
    } catch (error) {
      sentError = new Error(error.message)
    }

    if (sentError !== null) {
      throw sentError
    }

    if (updatedMinistryType === null) {
      throw new Error('Failed to update ministry type.')
    }

    return updatedMinistryType
  }

  async deleteMinistryTypeById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    try {
      const message = await this.ministryTypesModel.deleteMinistryTypeById(
        id,
        currentUser
      )
      return message
    } catch (error) {
      throw error
    }
  }
}
