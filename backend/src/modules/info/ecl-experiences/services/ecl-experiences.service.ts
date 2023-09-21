import { Injectable } from '@nestjs/common';
import { CreateEclExperienceDto } from '../dto/create-ecl-experience.dto';
import { UpdateExperiencesDto } from '../dto/update-ecl-experience.dto';
import {
  ICreateEclExperience,
  IEclExperience,
  IUpdateEclExperiences,
} from '../types/types';
import { ISpouse } from 'src/modules/spouses/types/types';
import { IUser } from 'src/modules/users/bz_types/types';
import { UsersService } from 'src/modules/users/dz_services/users.service';
import { SpousesModel } from 'src/modules/spouses/model/spouses.model';
import { EclExperiencesModel } from '../model/ecl-experiences.model';

@Injectable()
export class EclExperiencesService {
  constructor(
    private usersService: UsersService,
    private spouseModel: SpousesModel,
    private eclExperiencesModel: EclExperiencesModel
  ) {}

  async createEclExperience(
    dto: CreateEclExperienceDto,
    id: number
  ): Promise<IEclExperience> {
    try {
      const user = await this.usersService.findUserById(id);
      let person_id: number;
      if (user != null) {
        person_id = user.person_id;
      } else {
        throw new Error(`Não foi possível encontrar um usuário válido.`);
      }

      const createEclExperience: ICreateEclExperience = {
        person_id: person_id,
        ecl_exp_type_id: dto.ecl_exp_type_ids,
        ecl_exp_approved: null,
      };

      const newEclExperience =
        await this.eclExperiencesModel.createEclExperience(createEclExperience);
      return newEclExperience;
    } catch (error) {
      throw error;
    }
  }

  async findEclExperienceById(id: number): Promise<IEclExperience | null> {
    try {
      const eclExperience =
        await this.eclExperiencesModel.findEclExperienceById(id);
      return eclExperience;
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar a formação acadêmica com o id ${id}: ${error.message}`
      );
    }
  }

  async findEclesiasticExperienceByPersonId(
    id: number
  ): Promise<IEclExperience[] | null> {
    try {
      const user = await this.usersService.findUserById(id);
      let person_id: number;
      if (user != null) {
        person_id = user.person_id;
      } else {
        throw new Error(`Não foi possível encontrar um usuário válido.`);
      }

      const eclExperience =
        await this.eclExperiencesModel.findEclExperiencesByPersonId(person_id);
      return eclExperience;
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar formações acadêmicas para o usuário com id ${id}: ${error.message}`
      );
    }
  }

  async findAllEclExperiences(): Promise<IEclExperience[]> {
    try {
      const allEclExperiences =
        await this.eclExperiencesModel.findAllEclExperiences();
      return allEclExperiences;
    } catch (error) {
      throw error;
    }
  }

  async updateEclExperienceByPersonId(
    dto: UpdateExperiencesDto,
    id: number
  ): Promise<IEclExperience[]> {
    try {
      const user = await this.usersService.findUserById(id);
      let person_id: number;
      if (user != null) {
        person_id = user.person_id;
      } else {
        throw new Error(`Não foi possível encontrar um usuário válido.`);
      }

      const eclExperience =
        await this.eclExperiencesModel.findEclExperiencesByPersonId(person_id);

      let experiences: {
        person_id: number;
        ecl_exp_type_id: number;
        ecl_exp_approved: boolean | null;
      }[] = [];

      dto.ecl_exp_type_id.forEach((id) => {
        const isNew = eclExperience.every(
          (experience) => experience.ecl_exp_type_id !== id
        );

        if (isNew) {
          experiences.push({
            person_id: person_id,
            ecl_exp_type_id: id,
            ecl_exp_approved: null,
          });
        }
      });

      // Passo 2: Verificar elementos que sumiram no DTO
      eclExperience.forEach((experience) => {
        const isMissing = !dto.ecl_exp_type_id.includes(
          experience.ecl_exp_type_id
        );

        if (isMissing) {
          if (experience.ecl_exp_approved === true) {
            experiences.push({
              person_id: person_id,
              ecl_exp_type_id: experience.ecl_exp_type_id,
              ecl_exp_approved: true,
            });
          } else if (
            experience.ecl_exp_approved === null ||
            experience.ecl_exp_approved === false
          ) {
            // Não faz nada se for nulo ou falso
          }
        }
      });

      // Passo 3: Aquilo que se encontra nos dois
      dto.ecl_exp_type_id.forEach((id) => {
        const existingExperience = eclExperience.find(
          (experience) => experience.ecl_exp_type_id === id
        );

        if (existingExperience) {
          experiences.push({
            person_id: person_id,
            ecl_exp_type_id: id,
            ecl_exp_approved: existingExperience.ecl_exp_approved,
          });
        }
      });

      const updatedEclExperience: IUpdateEclExperiences = {
        ecl_exp_approved: null,
        ecl_exp_type_ids: dto.ecl_exp_type_id,
        person_id: person_id,
      };

      await this.eclExperiencesModel.updateEclExperienceByPersonId(
        experiences,
        person_id
      );
      const eclesiasticExperiences =
        await this.eclExperiencesModel.findEclExperiencesByPersonId(person_id);
      return eclesiasticExperiences;
    } catch (error) {
      throw error;
    }
  }

  async deleteEclExperienceById(id: number): Promise<string> {
    try {
      await this.eclExperiencesModel.deleteEclExperienceById(id);

      return 'Formação acadêmica deletada com sucesso.';
    } catch (error) {
      throw error;
    }
  }
}
