import { Injectable } from '@nestjs/common'
import { CreateEvangelisticExperienceDto } from '../dto/create-evangelistic-experience.dto'
import { UpdateEvangelisticExperienceDto } from '../dto/update-evangelistic-experience.dto'
import { UsersService } from 'src/modules/users/dz_services/users.service'
import {
  ICreateEvangelisticExperience,
  IEvangelisticExperience,
  IUpdateEvangelisticExperience,
} from '../types/types'
import { EvangelisticExperiencesModel } from '../model/evang-experiences.model'
import { ISpouse } from 'src/modules/spouses/types/types'
import { SpousesModel } from 'src/modules/spouses/model/spouses.model'

@Injectable()
export class EvangelisticExperiencesService {
  constructor(
    private usersService: UsersService,
    private evangelisticExperiencesModel: EvangelisticExperiencesModel,
    private spousesModel: SpousesModel,
  ) {}

  async createEclExperience(
    dto: CreateEvangelisticExperienceDto,
    user_id: number,
    personType: string,
  ): Promise<IEvangelisticExperience> {
    try {
      let personId!: number
      if (personType === 'student') {

        const user = await this.usersService.findUserById(user_id)
        
        if(user != null){
          personId = user.person_id
        }else{
          throw new Error(`Não foi possível encontrar um usuário válido.`)
        }
      } else if (personType === 'spouse') {
        let spouse: ISpouse | null = await this.spousesModel.findSpouseByUserId(
          user_id,
        )
        if (spouse == null) {
          throw new Error(
            `Não foi possível encontrar uma esposa vinculada ao usuário com id ${user_id}`,
          )
        }
        personId = spouse.person_id
      }

      const createEclExperienceData: ICreateEvangelisticExperience = {
        project: dto.project,
        place: dto.place,
        exp_begin_date: new Date(dto.exp_begin_date),
        exp_end_date: new Date(dto.exp_end_date),
        person_id: personId,
        evang_exp_approved: null,
        evang_exp_type_id: dto.evang_exp_type_id,
      }

      const newEclExperience =
        await this.evangelisticExperiencesModel.createEvangelisticExperience(
          createEclExperienceData,
        )
      return newEclExperience
    } catch (error) {
      throw error
    }
  }

  async findEvangelisticExperienceById(
    id: number,
  ): Promise<IEvangelisticExperience | null> {
    try {
      const evangelisticExperience =
        await this.evangelisticExperiencesModel.findEvangelisticExperienceById(
          id,
        )
      return evangelisticExperience
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar a experiência evangelística com o ID ${id}: ${error.message}`,
      )
    }
  }

  async findEvangelisticExperiencesByPersonId(
    user_id: number,
    personType: string,
  ): Promise<IEvangelisticExperience[] | null> {
    let evangelisticExperiences: IEvangelisticExperience[] | null = null
    try {
      let personId!: number
      if (personType === 'student') {

        const user = await this.usersService.findUserById(user_id)
        
        if(user != null){
          personId = user.person_id
        }else{
          throw new Error(`Não foi possível encontrar um usuário válido.`)
        }
      } else if (personType === 'spouse') {
        let spouse: ISpouse | null = await this.spousesModel.findSpouseByUserId(
          user_id,
        )
        if (spouse == null) {
          throw new Error(
            `Não foi possível encontrar uma esposa vinculada ao usuário com id ${user_id}`,
          )
        }
        personId = spouse.person_id
      }

      if(personId == null){
        evangelisticExperiences = []
      }else{
        evangelisticExperiences =
        await this.evangelisticExperiencesModel.findEvangelisticExperiencesByPersonId(
          personId,
        )
      }

      
      
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar experiências evangelísticas para o usuário com ID ${user_id}: ${error.message}`,
      )
    }
    return evangelisticExperiences
  }

  async findAllEvangelisticExperiences(): Promise<IEvangelisticExperience[]> {
    try {
      const allEvangelisticExperiences =
        await this.evangelisticExperiencesModel.findAllEvangelisticExperiences()
      return allEvangelisticExperiences
    } catch (error) {
      throw error
    }
  }

  async updateEvangelisticExperienceById(
    dto: UpdateEvangelisticExperienceDto,
    user_id: number,
  ): Promise<IEvangelisticExperience> {
    try {
      const begin_date = new Date(dto.exp_begin_date)
      const end_date = new Date(dto.exp_end_date)
      const user = await this.usersService.findUserById(user_id)
      let person_id: number
      if(user != null){
        person_id = user.person_id
      }else{
        throw new Error(`Não foi possível encontrar um usuário válido.`)
      }

      const updatedEvangelisticExperience: IUpdateEvangelisticExperience = {
        evang_exp_id: dto.evang_exp_id,
        project: dto.project,
        place: dto.place,
        exp_begin_date: begin_date,
        exp_end_date: end_date,
        evang_exp_type_id: dto.evang_exp_type_id,
        person_id: person_id,
        evang_exp_approved: null,
      }

      const updatedExperience =
        await this.evangelisticExperiencesModel.updateEvangelisticExperienceById(
          updatedEvangelisticExperience,
        )
      return updatedExperience
    } catch (error) {
      throw error
    }
  }
  async deleteEvangelisticExperienceById(id: number): Promise<string> {
    try {
      await this.evangelisticExperiencesModel.deleteEvangelisticExperienceById(
        id,
      )
      return 'Experiência evangelística deletada com sucesso.'
    } catch (error) {
      throw error
    }
  }
}
