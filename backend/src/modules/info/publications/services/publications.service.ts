import { Injectable } from '@nestjs/common';
import {
  IPublication,
  ICreatePublication,
  IUpdatePublication,
} from '../types/types';
import { UsersService } from 'src/modules/users/dz_services/users.service';
import { SpousesModel } from 'src/modules/spouses/model/spouses.model';
import { PublicationsModel } from '../model/publications.model';
import { CreatePublicationDto } from '../dto/create-publication.dto';
import { UpdatePublicationDto } from '../dto/update-publication.dto';
import { PeopleServices } from 'src/modules/people/dz_services/people.service';

@Injectable()
export class PublicationsService {
  constructor(
    private publicationsModel: PublicationsModel,
    private peopleService: PeopleServices
  ) {}

  async createPublication(
    dto: CreatePublicationDto,
    user_id: number,
    personType: string
  ): Promise<IPublication> {
    try {
      let personId = await this.peopleService.findPersonByUserId(
        user_id,
        personType
      );

      if (personId == null) {
        throw new Error(
          `Não foi encontrado uma pessoa vinculada ao usuário ${user_id}`
        );
      }

      const createPublicationData: ICreatePublication = {
        ...dto,
        person_id: personId,
        publication_approved: null,
      };

      const newPublication = await this.publicationsModel.createPublication(
        createPublicationData
      );
      return newPublication;
    } catch (error) {
      throw error;
    }
  }

  async findPublicationById(id: number): Promise<IPublication | null> {
    try {
      const publication = await this.publicationsModel.findPublicationById(id);
      return publication;
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar a publicação com o ID ${id}: ${error.message}`
      );
    }
  }

  async findPublicationsByPersonId(
    user_id: number,
    personType: string
  ): Promise<IPublication[] | null> {
    try {
      let personId = await this.peopleService.findPersonByUserId(
        user_id,
        personType
      );

      if (personId == null) {
        return [];
      }
      const publications =
        await this.publicationsModel.findPublicationsByPersonId(personId);
      return publications;
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar publicações para a pessoa com o ID fornecido: ${error.message}`
      );
    }
  }

  async findAllPublications(): Promise<IPublication[]> {
    try {
      const allPublications =
        await this.publicationsModel.findAllPublications();
      return allPublications;
    } catch (error) {
      throw error;
    }
  }

  async updatePublicationById(
    dto: UpdatePublicationDto
  ): Promise<IPublication> {
    try {
      const updatePublicationData: IUpdatePublication = {
        ...dto,
        publication_approved: null,
      };
      const publicationId = await this.publicationsModel.updatePublicationById(
        updatePublicationData
      );

      const updatedPublication =
        this.publicationsModel.findPublicationById(publicationId);

      return updatedPublication;
    } catch (error) {
      throw error;
    }
  }

  async deletePublicationById(id: number): Promise<string> {
    try {
      await this.publicationsModel.deletePublicationById(id);
      return 'Publicação deletada com sucesso.';
    } catch (error) {
      throw error;
    }
  }
}
