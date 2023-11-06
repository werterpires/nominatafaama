import { Injectable } from '@nestjs/common'
import { CreateMaritalStatusDto } from '../dto/create-marital-status.dto'
import { UpdateMaritalStatusDto } from '../dto/update-marital-status.dto'
import { MaritalStatusModel } from '../model/marital-status.model'
import {
  ICreateMaritalStatus,
  IMaritalStatus,
  IUpdateMaritalStatus
} from '../types/types'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class MaritalStatusService {
  constructor(private maritalStatusModel: MaritalStatusModel) {}
  async createMaritalStatus(
    dto: CreateMaritalStatusDto,
    currentUser: UserFromJwt
  ): Promise<IMaritalStatus> {
    try {
      const maritalStatus: ICreateMaritalStatus = {
        marital_status_type_name: dto.marital_status_type_name
      }

      const newMaritalStatus =
        await this.maritalStatusModel.createMaritalStatus(
          maritalStatus,
          currentUser
        )
      return newMaritalStatus
    } catch (error) {
      throw error
    }
  }

  async findMaritalStatusById(id: number): Promise<IMaritalStatus> {
    try {
      const maritalStatus = await this.maritalStatusModel.findMaritalStatusById(
        id
      )
      return maritalStatus as IMaritalStatus
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar o marital status com id ${id}: ${error.message}`
      )
    }
  }

  async findAllMaritalStatuses(): Promise<IMaritalStatus[]> {
    try {
      const maritalStatuses =
        await this.maritalStatusModel.findAllMaritalStatus()
      return maritalStatuses
    } catch (error) {
      throw error
    }
  }

  async updateMaritalStatusById(
    input: IUpdateMaritalStatus,
    currentUser: UserFromJwt
  ): Promise<IMaritalStatus> {
    let updatedMaritalStatus: IMaritalStatus | null = null
    let sentError: Error | null = null

    try {
      updatedMaritalStatus =
        await this.maritalStatusModel.updateMaritalStatusById(
          input,
          currentUser
        )
    } catch (error) {
      sentError = new Error(error.message)
    }

    if (sentError !== null) {
      throw sentError
    }

    if (updatedMaritalStatus === null) {
      throw new Error('O marital status não pôde ser atualizado')
    }

    return updatedMaritalStatus
  }

  async deleteMaritalStatusById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    try {
      const message = await this.maritalStatusModel.deleteMaritalStatusById(
        id,
        currentUser
      )
      return message
    } catch (error) {
      throw error
    }
  }
}
