import { Injectable } from '@nestjs/common'
import { PeopleServices } from 'src/modules/people/dz_services/people.service'
import { UsersService } from 'src/modules/users/dz_services/users.service'
import { CreateStudentDto } from '../dto/create-student.dto'
import { UpdateStudentDto } from '../dto/update-student.dto'
import { StudentsModel } from '../model/students.model'
import { ICreateStudent, IStudent, IUpdateStudent } from '../types/types'

@Injectable()
export class StudentsService {
  constructor(
    private studentsModel: StudentsModel,
    private peopleService: PeopleServices,
    private usersService: UsersService,
  ) {}

  async createStudent(
    dto: CreateStudentDto,
    userId: number,
  ): Promise<IStudent> {
    try {
      const user = await this.usersService.findUserById(userId)
      if (user == null) {
        throw new Error('Nenhum Usuário válido foi encontrado.')
      }
      const name = user.name
      const person_id = user.person_id

      const birthDate = new Date(dto.birth_date)
      const baptismDate = new Date(dto.baptism_date)

      const student: ICreateStudent = {
        phone_number: dto.phone_number,
        is_whatsapp: dto.is_whatsapp,
        alternative_email: dto.alternative_email,
        student_mensage: dto.student_mensage,
        person_id: person_id,
        origin_field_id: dto.origin_field_id,
        justification: dto.justification,
        birth_city: dto.birth_city,
        birth_state: dto.birth_state,
        primary_school_city: dto.primary_school_city,
        birth_date: birthDate,
        baptism_date: baptismDate,
        baptism_place: dto.baptism_place,
        marital_status_id: dto.marital_status_id,
        hiring_status_id: 1,
        primary_school_state: dto.primary_school_state,
        student_approved: null,
      }

      const newStudent = await this.studentsModel.createStudent(student, name)
      return newStudent
    } catch (error) {
      throw error
    }
  }

  async findStudentById(id: number): Promise<IStudent> {
    try {
      const student = await this.studentsModel.findStudentById(id)
      return student as IStudent
    } catch (error) {
      console.error(error)
      return null as any
    }
  }

  async findStudentByIdToEdit(id: number): Promise<IStudent> {
    try {
      const student = await this.studentsModel.findStudentByUserId(id)
      return student as IStudent
    } catch (error) {
      console.error(error)
      return null as any
    }
  }

  async findAllStudents(): Promise<IStudent[]> {
    try {
      const students = await this.studentsModel.findAllStudents()
      return students
    } catch (error) {
      throw error
    }
  }

  async updateStudentById(input: UpdateStudentDto): Promise<IStudent> {
    let updatedStudent: IStudent | null = null
    let sentError: Error | null = null

    const birthDate = new Date(input.birth_date)
    const baptismDate = new Date(input.baptism_date)

    const updateData: IUpdateStudent = {
      ...input,
      birth_date: birthDate,
      baptism_date: baptismDate,
      student_approved: null,
    }

    try {
      updatedStudent = await this.studentsModel.updateStudentById(updateData)
    } catch (error) {
      sentError = new Error(error.message)
    }

    if (sentError !== null) {
      throw sentError
    }

    if (updatedStudent === null) {
      throw new Error('Failed to update student')
    }
    if (updatedStudent) {
      return updatedStudent
    }
    throw new Error('deu ruim')
  }

  async deleteStudentById(id: number): Promise<string> {
    try {
      const message = await this.studentsModel.deleteStudentById(id)
      return message
    } catch (error) {
      throw error
    }
  }
}
