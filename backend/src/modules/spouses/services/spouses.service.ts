import { Injectable } from '@nestjs/common'
import { PeopleServices } from 'src/modules/people/dz_services/people.service'
import { StudentsService } from 'src/modules/students/services/students.service'
import { UsersService } from 'src/modules/users/dz_services/users.service'
import { CreateSpouseDto } from '../dto/create-spouse.dto'
import { UpdateSpouseDto } from '../dto/update-spouse.dto'
import { SpousesModel } from '../model/spouses.model'
import { ICreateSpouse, ISpouse, IUpdateSpouse } from '../types/types'

@Injectable()
export class SpousesService {
  constructor(
    private spousesModel: SpousesModel,
    private peopleService: PeopleServices,
    private usersService: UsersService,
    private studentService: StudentsService,
  ) {}

  async createSpouse(dto: CreateSpouseDto, id: number): Promise<void> {
    try {
      const { student_id } = await this.studentService.findStudentByIdToEdit(id)

      const birthDate = new Date(dto.birth_date)
      const baptismDate = new Date(dto.baptism_date)

      let civilMarryDate
      if (dto.civil_marriage_date != null) {
        civilMarryDate = new Date(dto.civil_marriage_date)
      } else {
        civilMarryDate = null
      }
      const spouse: ICreateSpouse = {
        phone_number: dto.phone_number,
        is_whatsapp: dto.is_whatsapp,
        alternative_email: dto.alternative_email,
        origin_field_id: dto.origin_field_id,
        justification: dto.justification,
        birth_city: dto.birth_city,
        birth_state: dto.birth_state,
        primary_school_city: dto.primary_school_city,
        birth_date: birthDate,
        baptism_date: baptismDate,
        baptism_place: dto.baptism_place,
        civil_marriage_date: civilMarryDate,
        civil_marriage_city: dto.civil_marriage_city,
        registry: dto.registry,
        registry_number: dto.registry_number,
        name: dto.name,
        cpf: dto.cpf,
        primary_school_state: dto.civil_marriage_state,
        student_id: student_id,
        civil_marriage_state: dto.civil_marriage_state,
      }

      await this.spousesModel.createSpouse(spouse)
    } catch (error) {
      throw error
    }
  }

  async findSpouseByUserId(id: number): Promise<ISpouse> {
    try {
      const spouse = await this.spousesModel.findSpouseByUserId(id)
      return spouse as ISpouse
    } catch (error) {
      throw new Error(`Failed to find spouse with id ${id}: ${error.message}`)
    }
  }

  async updateSpouseById(input: UpdateSpouseDto, id: number): Promise<ISpouse> {
    let updatedSpouse: ISpouse | null = null
    let sentError: Error | null = null

    const birthDate = new Date(input.birth_date)
    const baptismDate = new Date(input.baptism_date)

    let civilMarryDate
    if (input.civil_marriage_date != null) {
      civilMarryDate = new Date(input.civil_marriage_date)
    } else {
      civilMarryDate = null
    }

    const { student_id } = await this.studentService.findStudentByIdToEdit(id)

    const updateData: IUpdateSpouse = {
      ...input,
      birth_date: birthDate,
      baptism_date: baptismDate,
      civil_marriage_date: civilMarryDate,
      student_id: student_id,
    }

    try {
      updatedSpouse = await this.spousesModel.updateSpouseById(updateData)
    } catch (error) {
      sentError = new Error(error.message)
    }

    if (sentError !== null) {
      throw sentError
    }

    if (updatedSpouse === null) {
      throw new Error('Failed to update spouse')
    }

    return updatedSpouse
  }

  async deleteSpouseById(id: number): Promise<string> {
    try {
      const message = await this.spousesModel.deleteSpouseById(id)
      return message
    } catch (error) {
      throw error
    }
  }
}
