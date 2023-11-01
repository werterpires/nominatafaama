import { Injectable } from '@nestjs/common';
import { CreateAssociationDto } from '../dto/create-association.dto';
import { UpdateAssociationDto } from '../dto/update-association.dto';
import { AssociationsModel } from '../model/associations.model';
import {
  IAssociation,
  ICreateAssociation,
  IUpdateAssociation,
} from '../types/types';
import { UserFromJwt } from 'src/shared/auth/types/types';

@Injectable()
export class AssociationsService {
  constructor(private associationsModel: AssociationsModel) {}

  async createAssociation(
    dto: CreateAssociationDto,
    currentUser: UserFromJwt
  ): Promise<IAssociation> {
    try {
      const association: ICreateAssociation = {
        association_name: dto.association_name,
        association_acronym: dto.association_acronym,
        union_id: dto.union_id,
      };

      const newAssociation = await this.associationsModel.createAssociation(
        association,
        currentUser
      );
      return newAssociation;
    } catch (error) {
      throw error;
    }
  }

  async findAssociationById(id: number): Promise<IAssociation> {
    try {
      const association = await this.associationsModel.findAssociationById(id);
      return association as IAssociation;
    } catch (error) {
      throw new Error(
        `Failed to find association with id ${id}: ${error.message}`
      );
    }
  }

  async findAllAssociations(): Promise<IAssociation[]> {
    try {
      const associations = await this.associationsModel.findAllAssociations();
      return associations;
    } catch (error) {
      throw error;
    }
  }

  async updateAssociationById(
    input: IUpdateAssociation,
    currentUser: UserFromJwt
  ): Promise<IAssociation | null> {
    let updatedAssociation: IAssociation | null = null;
    let sentError: Error | null = null;

    try {
      updatedAssociation = await this.associationsModel.updateAssociationById(
        input,
        currentUser
      );
    } catch (error) {
      sentError = new Error(error.message);
    }

    if (sentError !== null) {
      throw sentError;
    }

    return updatedAssociation;
  }

  async deleteAssociationById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    try {
      const message = await this.associationsModel.deleteAssociationById(
        id,
        currentUser
      );
      return message;
    } catch (error) {
      throw error;
    }
  }
}
