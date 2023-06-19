import { Injectable } from '@nestjs/common'
import { SpousesModel } from 'src/modules/spouses/model/spouses.model'
import { UsersService } from 'src/modules/users/dz_services/users.service'
import { CreateAcademicFormationDto } from '../dto/create-academic-formation.dto'
import { UpdateAcademicFormationDto } from '../dto/update-academic-formation.dto'
import { AcademicFormationsModel } from '../model/academic-formations.model'
import {
  IAcademicFormation,
  ICreateAcademicFormation,
  IUpdateAcademicFormation,
} from '../types/types'

@Injectable()
export class AcademicFormationsService {
  constructor(
    private academicFormationsModel: AcademicFormationsModel,
    private usersService: UsersService,
    private spouseModel: SpousesModel,
  ) {}

  async createStudentAcademicFormation(
    dto: CreateAcademicFormationDto,
    id: number,
  ): Promise<IAcademicFormation> {
    try {
      const person = await this.usersService.findUserById(id)
      let person_id: number
      if(person != null){
        person_id = person.person_id
      }else{
        throw new Error(`Não foi possível encontrar um usuário válido.`)
      }
      

      const createAcademicFormation: ICreateAcademicFormation = {
        course_area: dto.course_area,
        institution: dto.institution,
        begin_date: new Date(dto.begin_date),
        conclusion_date: dto.conclusion_date
          ? new Date(dto.conclusion_date)
          : null,
        person_id: person_id,
        degree_id: dto.degree_id,
        academic_formation_approved: null,
      }

      const newAcademicFormation =
        await this.academicFormationsModel.createAcademicFormation(
          createAcademicFormation,
        )
      return newAcademicFormation
    } catch (error) {
      throw error
    }
  }

  async createSpouseAcademicFormation(
    dto: CreateAcademicFormationDto,
    id: number,
  ): Promise<IAcademicFormation> {
    const spouse = await this.spouseModel.findSpouseByUserId(id)

    if (!spouse) {
      throw Error(`Spouse not found for id ${id}`)
    }

    const { person_id } = spouse

    const createAcademicFormation: ICreateAcademicFormation = {
      course_area: dto.course_area,
      institution: dto.institution,
      begin_date: new Date(dto.begin_date),
      conclusion_date: dto.conclusion_date
        ? new Date(dto.conclusion_date)
        : null,
      person_id: person_id,
      degree_id: dto.degree_id,
      academic_formation_approved: null,
    }

    const newAcademicFormation =
      await this.academicFormationsModel.createAcademicFormation(
        createAcademicFormation,
      )
    return newAcademicFormation
  }

  async findAcademicFormationById(
    id: number,
  ): Promise<IAcademicFormation | null> {
    try {
      const academicFormation =
        await this.academicFormationsModel.findAcademicFormationById(id)
      return academicFormation
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar a formação acadêmica com o id ${id}: ${error.message}`,
      )
    }
  }

  async findStudentAcademicFormationByPersonId(
    id: number,
  ): Promise<IAcademicFormation[] | null> {
    try {
      const person = await this.usersService.findUserById(id)
      let person_id: number
      if(person != null){
        person_id = person.person_id
      }else{
        throw new Error(`Não foi possível encontrar um usuário válido.`)
      }

      const academicFormation =
        await this.academicFormationsModel.findAcademicFormationsByPersonId(
          person_id,
        )
      return academicFormation
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar formações acadêmicas para o usuário com id ${id}: ${error.message}`,
      )
    }
  }

  async findSpouseAcademicFormationByPersonId(
    id: number,
  ): Promise<IAcademicFormation[] | null> {
    try {
      const spouse = await this.spouseModel.findSpouseByUserId(id)
      if (spouse) {
        const { person_id } = spouse

        const academicFormation =
          await this.academicFormationsModel.findAcademicFormationsByPersonId(
            person_id,
          )
        return academicFormation
      } else {
        return []
      }
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar formações acadêmicas para o usuário com id ${id}: ${error.message}`,
      )
    }
  }

  async findAllAcademicFormations(): Promise<IAcademicFormation[]> {
    try {
      const academicFormations =
        await this.academicFormationsModel.findAllAcademicFormations()
      return academicFormations
    } catch (error) {
      throw error
    }
  }

  async updateAcademicFormationById(
    dto: UpdateAcademicFormationDto,
  ): Promise<IAcademicFormation> {
    try {
      const updatedAcademicFormation: IUpdateAcademicFormation = {
        formation_id: dto.formation_id,
        course_area: dto.course_area,
        institution: dto.institution,
        begin_date: new Date(dto.begin_date),
        conclusion_date: dto.conclusion_date
          ? new Date(dto.conclusion_date)
          : null,
        degree_id: dto.degree_id,
        academic_formation_approved: null,
      }

      const updatedFormation =
        await this.academicFormationsModel.updateAcademicFormationById(
          updatedAcademicFormation,
        )
      return updatedFormation
    } catch (error) {
      throw error
    }
  }

  async deleteAcademicFormationById(id: number): Promise<string> {
    try {
      await this.academicFormationsModel.deleteAcademicFormationById(id)

      return 'Formação acadêmica deletada com sucesso.'
    } catch (error) {
      throw error
    }
  }
}
