import { Injectable } from '@nestjs/common';
import { CreateAssociationDto } from '../dto/create-association.dto';
import { UpdateAssociationDto } from '../dto/update-association.dto';
import { AssociationsModel } from '../model/associations.model';
import { IAssociation, ICreateAssociation, IUpdateAssociation } from '../types/types';

@Injectable()
export class AssociationsService {

  constructor(private associationsModel:AssociationsModel){}

  async createAssociation(dto: CreateAssociationDto): Promise<IAssociation> {
    try {
      const association: ICreateAssociation = {
        association_name: dto.association_name,
        association_acronym: dto.association_acronym,
        union_id: dto.union_id,
      };
  
      const newAssociation = await this.associationsModel.createAssociation(association);
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
      throw new Error(`Failed to find association with id ${id}: ${error.message}`);
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
  
  async updateAssociationById(input: IUpdateAssociation): Promise<IAssociation> {
    let updatedAssociation: IAssociation | null = null;
    let sentError: Error | null = null;
  
    try {
      updatedAssociation = await this.associationsModel.updateAssociationById(input);
    } catch (error) {
      sentError = new Error(error.message);
    }
  
    if (sentError !== null) {
      throw sentError;
    }
  
    if (updatedAssociation === null) {
      throw new Error('Failed to update association');
    }
  
    return updatedAssociation;
  }
  
  async deleteAssociationById(id: number): Promise<string> {
    try {
      const message = await this.associationsModel.deleteAssociationById(id);
      return message;
    } catch (error) {
      throw error;
    }
  }
  
}
