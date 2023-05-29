import { Injectable } from '@nestjs/common'
import { CreateEclExperienceDto } from '../dto/create-ecl-experience.dto'
import { UpdateExperiencesDto } from '../dto/update-ecl-experience.dto'
import {
  ICreateEclExperience,
  IEclExperience,
  IUpdateEclExperiences,
} from '../types/types'
import { ISpouse } from 'src/modules/spouses/types/types'
import { IUser } from 'src/modules/users/bz_types/types'
import { UsersService } from 'src/modules/users/dz_services/users.service'
import { SpousesModel } from 'src/modules/spouses/model/spouses.model'
import { EclExperiencesModel } from '../model/ecl-experiences.model'

@Injectable()
export class EclExperiencesService {
  constructor(
    private usersService: UsersService,
    private spouseModel: SpousesModel,
    private eclExperiencesModel: EclExperiencesModel,
  ) {}

  async createEclExperience(
    dto: CreateEclExperienceDto,
    id: number,
  ): Promise<IEclExperience> {
    try {
      const person = await this.usersService.findUserById(id)

      const person_id = person.person_id

      const createEclExperience: ICreateEclExperience = {
        person_id: person_id,
        ecl_exp_type_id: dto.ecl_exp_type_ids,
        ecl_exp_approved: null,
      }

      const newEclExperience =
        await this.eclExperiencesModel.createEclExperience(createEclExperience)
      return newEclExperience
    } catch (error) {
      throw error
    }
  }

  async findEclExperienceById(id: number): Promise<IEclExperience | null> {
    try {
      const eclExperience =
        await this.eclExperiencesModel.findEclExperienceById(id)
      return eclExperience
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar a formação acadêmica com o id ${id}: ${error.message}`,
      )
    }
  }

  async findEclesiasticExperienceByPersonId(
    id: number,
  ): Promise<IEclExperience[] | null> {
    try {
      const { person_id } = await this.usersService.findUserById(id)
      console.log(person_id)

      const eclExperience =
        await this.eclExperiencesModel.findEclExperiencesByPersonId(person_id)
      return eclExperience
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar formações acadêmicas para o usuário com id ${id}: ${error.message}`,
      )
    }
  }

  async findAllEclExperiences(): Promise<IEclExperience[]> {
    try {
      const allEclExperiences =
        await this.eclExperiencesModel.findAllEclExperiences()
      return allEclExperiences
    } catch (error) {
      throw error
    }
  }

  async updateEclExperienceByPersonId(
    dto: UpdateExperiencesDto,
    id: number,
  ): Promise<IEclExperience[]> {
    try {
      const person = await this.usersService.findUserById(id)
      const person_id = person.person_id
      const updatedEclExperience: IUpdateEclExperiences = {
        ecl_exp_approved: null,
        ecl_exp_type_ids: dto.ecl_exp_type_id,
        person_id: person_id,
      }

      await this.eclExperiencesModel.updateEclExperienceByPersonId(
        updatedEclExperience,
      )
      const eclesiasticExperiences =
        await this.eclExperiencesModel.findEclExperiencesByPersonId(person_id)
      return eclesiasticExperiences
    } catch (error) {
      throw error
    }
  }

  async deleteEclExperienceById(id: number): Promise<string> {
    try {
      await this.eclExperiencesModel.deleteEclExperienceById(id)

      return 'Formação acadêmica deletada com sucesso.'
    } catch (error) {
      throw error
    }
  }
}
