import { Injectable } from '@nestjs/common'
import { ProfessionalExperiencesModel } from '../model/professional-experiences.model'
import { CreateProfessionalExperienceDto } from '../dto/create-professional-experience.dto'
import { UpdateProfessionalExperienceDto } from '../dto/update-professional-experience.dto'
import {
  IProfessionalExperience,
  ICreateProfessionalExperience,
  IUpdateProfessionalExperience,
} from '../types/types'
import { UsersService } from 'src/modules/users/dz_services/users.service'
import { SpousesModel } from 'src/modules/spouses/model/spouses.model'
import { ISpouse } from 'src/modules/spouses/types/types'

@Injectable()
export class ProfessionalExperiencesService {
  constructor(
    private experiencesModel: ProfessionalExperiencesModel,
    private usersService: UsersService,
    private spouseModel: SpousesModel,
  ) {}

  async createProfessionalExperience(
    dto: CreateProfessionalExperienceDto,
    user_id: number,
    personType: string,
  ): Promise<IProfessionalExperience> {
    try {
      let personId!: number
      if (personType === 'student') {
        personId = (await this.usersService.findUserById(user_id)).person_id
      } else if (personType === 'spouse') {
        let spouse: ISpouse | null = await this.spouseModel.findSpouseByUserId(
          user_id,
        )
        if (spouse == null) {
          throw new Error(
            `Não foi possível encontrar uma esposa vinculada ao usuário com id ${user_id}`,
          )
        }
        personId = spouse.person_id
      }

      const createExperienceData: ICreateProfessionalExperience = {
        ...dto,
        job_begin_date: new Date(dto.job_begin_date),
        job_end_date: dto.job_end_date ? new Date(dto.job_end_date) : null,
        person_id: personId,
        experience_approved: null,
      }

      const newExperience =
        await this.experiencesModel.createProfessionalExperience(
          createExperienceData,
        )
      return newExperience
    } catch (error) {
      throw error
    }
  }

  async findProfessionalExperienceById(
    id: number,
  ): Promise<IProfessionalExperience | null> {
    try {
      const experience =
        await this.experiencesModel.findProfessionalExperienceById(id)
      return experience
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar a experiência profissional com o ID ${id}: ${error.message}`,
      )
    }
  }

  async findProfessionalExperiencesByPersonId(
    user_id: number,
    personType: string,
  ): Promise<IProfessionalExperience[] | null> {
    try {
      let personId!: number | null
      if (personType === 'student') {
        personId = (await this.usersService.findUserById(user_id)).person_id
      } else if (personType === 'spouse') {
        let spouse: ISpouse | null = await this.spouseModel.findSpouseByUserId(
          user_id,
        )
        if (spouse == null) {
         personId = null
        } else{
          personId = spouse.person_id
        }
        
      }
      let experiences: IProfessionalExperience[]
      if(personId==null){
        experiences = []
      }else{
        experiences =
        await this.experiencesModel.findProfessionalExperiencesByPersonId(
          personId,
        )
      }
      
      return experiences
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar experiências profissionais para a pessoa com o ID fornecido: ${error.message}`,
      )
    }
  }

  async findAllProfessionalExperiences(): Promise<IProfessionalExperience[]> {
    try {
      const allExperiences =
        await this.experiencesModel.findAllProfessionalExperiences()
      return allExperiences
    } catch (error) {
      throw error
    }
  }

  async updateProfessionalExperienceById(
    dto: UpdateProfessionalExperienceDto,
  ): Promise<IProfessionalExperience> {
    try {
      const updateExperienceData: IUpdateProfessionalExperience = {
        ...dto,
        job_begin_date: new Date(dto.job_begin_date),
        job_end_date: dto.job_end_date ? new Date(dto.job_end_date) : null,
        experience_approved: null,
      }

      const updatedExperience =
        await this.experiencesModel.updateProfessionalExperienceById(
          updateExperienceData,
        )
      return updatedExperience
    } catch (error) {
      throw error
    }
  }

  async deleteProfessionalExperienceById(id: number): Promise<string> {
    try {
      await this.experiencesModel.deleteProfessionalExperienceById(id)
      return 'Experiência profissional deletada com sucesso.'
    } catch (error) {
      throw error
    }
  }
}
