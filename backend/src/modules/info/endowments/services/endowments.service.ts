import { Injectable } from '@nestjs/common'
import { IEndowment, ICreateEndowment, IUpdateEndowment } from '../types/types'
import { EndowmentsModel } from '../model/endowments.model'
import { CreateEndowmentDto } from '../dto/create-endowment.dto'
import { UpdateEndowmentDto } from '../dto/update-endowment.dto'
import { PeopleServices } from 'src/modules/people/dz_services/people.service'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class EndowmentsService {
  constructor(
    private endowmentsModel: EndowmentsModel,
    private peopleService: PeopleServices
  ) {}

  async createEndowment(
    dto: CreateEndowmentDto,
    user_id: number,
    personType: string,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      let personId = await this.peopleService.findPersonByUserId(
        user_id,
        personType
      )

      if (personId == null) {
        throw new Error(
          `Não foi encontrado uma pessoa vinculada ao usuário ${user_id}`
        )
      }

      const createEndowmentData: ICreateEndowment = {
        ...dto,
        person_id: personId,
        endowment_approved: null
      }

      await this.endowmentsModel.createEndowment(
        createEndowmentData,
        currentUser
      )

      return true
    } catch (error) {
      throw error
    }
  }

  async findEndowmentById(id: number): Promise<IEndowment | null> {
    try {
      const endowment = await this.endowmentsModel.findEndowmentById(id)
      return endowment
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar a investidura com o ID ${id}: ${error.message}`
      )
    }
  }

  async findEndowmentsByPersonId(
    user_id: number,
    personType: string
  ): Promise<IEndowment[] | null> {
    try {
      let personId = await this.peopleService.findPersonByUserId(
        user_id,
        personType
      )

      if (personId == null) {
        return []
      }

      const endowments = await this.endowmentsModel.findEndowmentsByPersonId(
        personId
      )
      return endowments
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar investiduras para a pessoa com o ID fornecido: ${error.message}`
      )
    }
  }

  async findAllEndowments(): Promise<IEndowment[]> {
    try {
      const allEndowments = await this.endowmentsModel.findAllEndowments()
      return allEndowments
    } catch (error) {
      throw error
    }
  }

  async updateEndowmentById(
    dto: UpdateEndowmentDto,
    currentUser: UserFromJwt
  ): Promise<IEndowment> {
    try {
      const updateEndowmentData: IUpdateEndowment = {
        ...dto,
        endowment_approved: null
      }
      const endowmentId = await this.endowmentsModel.updateEndowmentById(
        updateEndowmentData,
        currentUser
      )

      const updatedEndowment = this.endowmentsModel.findEndowmentById(
        dto.endowment_id
      )

      return updatedEndowment
    } catch (error) {
      throw error
    }
  }

  async deleteEndowmentById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    try {
      await this.endowmentsModel.deleteEndowmentById(id, currentUser)
      return 'Investidura deletada com sucesso.'
    } catch (error) {
      throw error
    }
  }
}
