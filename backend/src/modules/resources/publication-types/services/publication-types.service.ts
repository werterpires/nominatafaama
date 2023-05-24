import { Injectable } from '@nestjs/common';
import { CreatePublicationTypeDto } from '../dto/create-publication-type.dto';
import { ICreatePublicationType, IPublicationType, IUpdatePublicationType } from '../types/types';
import { PublicationTypeModel } from '../model/publication-types.model';

@Injectable()
export class PublicationTypesService {
  constructor(private publicationTypeModel:PublicationTypeModel){}
  async createPublicationType(dto: CreatePublicationTypeDto): Promise<IPublicationType> {
    try {
      const publicationType: ICreatePublicationType = {
        publication_type:dto.publication_type,
        instructions: dto.instructions,
      };

      const newUnion = await this.publicationTypeModel.createPublicationType(publicationType);
      return newUnion;
    } catch (error) {
      throw error;
    }
  }

  async findPublicationTypeById(id: number): Promise<IPublicationType> {
    try {
      const union = await this.publicationTypeModel.findPublicationTypeById(id);
      return union as IPublicationType;
    } catch (error) {
      throw new Error(`Failed to find union with id ${id}: ${error.message}`);
    }
  }

  async findAllPublicationTypes(): Promise<IPublicationType[]> {
    try {
      const unions = await this.publicationTypeModel.findAllPublicationTypes();
      return unions;
    } catch (error) {
      throw error;
    }
  }

  async updatePublicationTypeById(input: IUpdatePublicationType): Promise<IPublicationType> {
    let updatedPublicationType: IPublicationType | null = null;
    let sentError: Error | null = null;

    try {
      updatedPublicationType = await this.publicationTypeModel.updatePublicationTypeById(input);
    } catch (error) {
      sentError = new Error(error.message);
    }

    if (sentError !== null) {
      throw sentError;
    }

    if (updatedPublicationType === null) {
      throw new Error('Failed to update union');
    }

    return updatedPublicationType;
  }

  async deletePublicationTypeById(id: number): Promise<string> {
    try {
      const message = await this.publicationTypeModel.deletePublicationTypeById(id);
      return message;
    } catch (error) {
      throw error;
    }
  }
}
