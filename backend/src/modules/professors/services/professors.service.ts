import { Injectable } from '@nestjs/common'
import { PeopleServices } from 'src/modules/people/dz_services/people.service'
import { UsersService } from 'src/modules/users/dz_services/users.service'
import { CreateProfessorAssignmentDto } from '../dto/create-professors.dto'
import { UpdateProfessorAssgnment } from '../dto/update-professors.dto'
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
        approved: null,
        assignments: dto.assignments,
        person_id: person_id,
      }

      const newProfessor = await this.professorsModel.createProfessor(professor)
      return newProfessor
    } catch (error) {
      throw error
    }
  }

  // async findStudentById(id: number): Promise<IStudent> {
  //   try {
  //     const student = await this.studentsModel.findStudentById(id)
  //     return student as IStudent
  //   } catch (error) {
  //     console.error(error)
  //     return null as any
  //   }
  // }

  // async findStudentByIdToEdit(id: number): Promise<IStudent> {
  //   try {
  //     const student = await this.studentsModel.findStudentByUserId(id)
  //     return student as IStudent
  //   } catch (error) {
  //     console.error(error)
  //     return null as any
  //   }
  // }

  // async findAllStudents(): Promise<IStudent[]> {
  //   try {
  //     const students = await this.studentsModel.findAllStudents()
  //     return students
  //   } catch (error) {
  //     throw error
  //   }
  // }

  // async updateStudentById(input: UpdateStudentDto): Promise<IStudent> {
  //   let updatedStudent: IStudent | null = null
  //   let sentError: Error | null = null

  //   const birthDate = new Date(input.birth_date)
  //   const baptismDate = new Date(input.baptism_date)

  //   const updateData: IUpdateStudent = {
  //     ...input,
  //     birth_date: birthDate,
  //     baptism_date: baptismDate,
  //     student_approved: null,
  //   }

  //   try {
  //     updatedStudent = await this.studentsModel.updateStudentById(updateData)
  //   } catch (error) {
  //     sentError = new Error(error.message)
  //   }

  //   if (sentError !== null) {
  //     throw sentError
  //   }

  //   if (updatedStudent === null) {
  //     throw new Error('Failed to update student')
  //   }
  //   if (updatedStudent) {
  //     return updatedStudent
  //   }
  //   throw new Error('deu ruim')
  // }

  // async deleteStudentById(id: number): Promise<string> {
  //   try {
  //     const message = await this.studentsModel.deleteStudentById(id)
  //     return message
  //   } catch (error) {
  //     throw error
  //   }
  // }
}
