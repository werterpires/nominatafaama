import { Injectable } from '@nestjs/common'
import { PeopleServices } from 'src/modules/people/dz_services/people.service'
import { UsersService } from 'src/modules/users/dz_services/users.service'
import { CreateProfessorAssignmentDto } from '../dto/create-professors.dto'
import { UpdateProfessorAssgnmentDto } from '../dto/update-professors.dto'
import { ProfessorsModel } from '../model/professors.model'
import {
  ICreateProfessorAssgnment,
  IProfessor,
  IUpdateProfessor,
} from '../types/types'

@Injectable()
export class ProfessorsService {
  constructor(
    private professorsModel: ProfessorsModel,
    private peopleService: PeopleServices,
    private usersService: UsersService,
  ) {}

  async createProfessor(
    dto: CreateProfessorAssignmentDto,
    userId: number,
  ): Promise<IProfessor> {
    try {
      const user = await this.usersService.findUserById(userId)
      if (user == null) {
        throw new Error('Nenhum Usuário válido foi encontrado.')
      }
      const person_id = user.person_id

      const professor: ICreateProfessorAssgnment = {
        approved: true,
        assignments: dto.assignments,
        person_id: person_id,
      }

      const newProfessor = await this.professorsModel.createProfessor(professor)
      return newProfessor
    } catch (error) {
      throw error
    }
  }

  async findProfessorByIdToEdit(id: number): Promise<IProfessor> {
    try {
      const professor = await this.professorsModel.findProfessorByUserId(id)
      return professor as IProfessor
    } catch (error) {
      console.error(error)
      return null as any
    }
  }

  async updateProfessorById(
    input: UpdateProfessorAssgnmentDto,
  ): Promise<IProfessor> {
    let updatedProfessor: IProfessor | null = null
    let sentError: Error | null = null

    const updateData: IUpdateProfessor = {
      ...input,
      approved: true,
    }

    try {
      updatedProfessor = await this.professorsModel.updateProfessorById(
        updateData,
      )
    } catch (error) {
      sentError = new Error(error.message)
    }

    if (sentError !== null) {
      throw sentError
    }

    if (updatedProfessor === null) {
      throw new Error('Failed to update professor')
    }
    if (updatedProfessor) {
      return updatedProfessor
    }
    throw new Error('Não foi possível atualizar o professor')
  }

  // async deleteStudentById(id: number): Promise<string> {
  //   try {
  //     const message = await this.studentsModel.deleteStudentById(id)
  //     return message
  //   } catch (error) {
  //     throw error
  //   }
  // }
}
