import { Injectable } from '@nestjs/common';
import {
  IRelatedMinistry,
  ICreateRelatedMinistry,
  IUpdateRelatedMinistry,
} from '../types/types';
import { RelatedMinistriesModel } from '../model/related-ministries.model';
import { CreateRelatedMinistryDto } from '../dto/create-related-ministry.dto';
import { UpdateRelatedMinistryDto } from '../dto/update-related-ministry.dto';
import { PeopleServices } from 'src/modules/people/dz_services/people.service';
import { UserFromJwt } from 'src/shared/auth/types/types';

@Injectable()
export class RelatedMinistriesService {
  constructor(
    private relatedMinistriesModel: RelatedMinistriesModel,
    private peopleServices: PeopleServices
  ) {}

  async createRelatedMinistry(
    dto: CreateRelatedMinistryDto,
    user_id: number,
    personType: string,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      const personId = await this.peopleServices.findPersonByUserId(
        user_id,
        personType
      );
      if (personId == null) {
        throw new Error(
          `Não foi encontrado uma pessoa vinculada ao usuário ${user_id}`
        );
      }

      const createRelatedMinistryData: ICreateRelatedMinistry = {
        ...dto,
        person_id: personId,
        related_ministry_approved: null,
      };

      const relatedMinistryId =
        await this.relatedMinistriesModel.createRelatedMinistry(
          createRelatedMinistryData,
          currentUser
        );

      return true;
    } catch (error) {
      throw error;
    }
  }

  async findRelatedMinistryById(id: number): Promise<IRelatedMinistry | null> {
    try {
      const relatedMinistry =
        await this.relatedMinistriesModel.findRelatedMinistryById(id);
      return relatedMinistry;
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar o ministério relacionado com o ID ${id}: ${error.message}`
      );
    }
  }

  async findRelatedMinistriesByPersonId(
    user_id: number,
    personType: string
  ): Promise<IRelatedMinistry[] | null> {
    try {
      const personId = await this.peopleServices.findPersonByUserId(
        user_id,
        personType
      );

      if (personId == null) {
        return [];
      }

      const relatedMinistries =
        await this.relatedMinistriesModel.findRelatedMinistriesByPersonId(
          personId
        );
      return relatedMinistries;
    } catch (error) {
      console.error(error);
      throw new Error(
        `Não foi possível encontrar ministérios relacionados para a pessoa com o ID fornecido: ${error.message}`
      );
    }
  }

  async findAllRelatedMinistries(): Promise<IRelatedMinistry[]> {
    try {
      const allRelatedMinistries =
        await this.relatedMinistriesModel.findAllRelatedMinistries();
      return allRelatedMinistries;
    } catch (error) {
      throw error;
    }
  }

  async updateRelatedMinistryById(
    dto: UpdateRelatedMinistryDto,
    currentUser: UserFromJwt
  ): Promise<IRelatedMinistry> {
    try {
      const updateRelatedMinistryData: IUpdateRelatedMinistry = {
        ...dto,
        related_ministry_approved: null,
      };

      const relatedMinistryId =
        await this.relatedMinistriesModel.updateRelatedMinistryById(
          updateRelatedMinistryData,
          currentUser
        );

      const updatedRelatedMinistry =
        this.relatedMinistriesModel.findRelatedMinistryById(
          dto.related_ministry_id
        );

      return updatedRelatedMinistry;
    } catch (error) {
      throw error;
    }
  }

  async deleteRelatedMinistryById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    try {
      await this.relatedMinistriesModel.deleteRelatedMinistryById(
        id,
        currentUser
      );
      return 'Ministério de interesse deletado com sucesso.';
    } catch (error) {
      throw error;
    }
  }
}
