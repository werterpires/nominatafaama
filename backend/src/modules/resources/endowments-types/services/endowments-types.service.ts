import { Injectable } from '@nestjs/common';
import { IEndowmentType, ICreateEndowmentType, IUpdateEndowmentType } from '../types/types';
import { CreateEndowmentTypeDto } from '../dto/create-endowments-type.dto';
import { EndowmentTypesModel } from '../model/endowments-types.model';

@Injectable()
export class EndowmentTypesService {
  constructor(private endowmentTypesModel: EndowmentTypesModel) {}

  async createEndowmentType(dto: CreateEndowmentTypeDto): Promise<IEndowmentType> {
    try {
      const endowmentType: ICreateEndowmentType = {
        endowment_type_name: dto.endowment_type_name,
        application: dto.application,
      };

      const newEndowmentType = await this.endowmentTypesModel.createEndowmentType(endowmentType);
      return newEndowmentType;
    } catch (error) {
      throw error;
    }
  }

  async findEndowmentTypeById(id: number): Promise<IEndowmentType> {
    try {
      const endowmentType = await this.endowmentTypesModel.findEndowmentTypeById(id);
      return endowmentType as IEndowmentType;
    } catch (error) {
      throw new Error(`Failed to find endowment type with id ${id}: ${error.message}`);
    }
  }

  async findAllEndowmentTypes(): Promise<IEndowmentType[]> {
    try {
      const endowmentTypes = await this.endowmentTypesModel.findAllEndowmentTypes();
      return endowmentTypes;
    } catch (error) {
      throw error;
    }
  }

  async updateEndowmentTypeById(input: IUpdateEndowmentType): Promise<IEndowmentType> {
    let updatedEndowmentType: IEndowmentType | null = null;
    let sentError: Error | null = null;

    try {
      updatedEndowmentType = await this.endowmentTypesModel.updateEndowmentTypeById(input);
    } catch (error) {
      sentError = new Error(error.message);
    }

    if (sentError !== null) {
      throw sentError;
    }

    if (updatedEndowmentType === null) {
      throw new Error('Failed to update endowment type.');
    }

    return updatedEndowmentType;
  }

  async deleteEndowmentTypeById(id: number): Promise<string> {
    try {
      const message = await this.endowmentTypesModel.deleteEndowmentTypeById(id);
      return message;
    } catch (error) {
      throw error;
    }
  }

  async findEndowmentTypesByApplicationType(applicationType: string): Promise<IEndowmentType[]> {
    let endowmentTypes: IEndowmentType[] = [];
    let sentError: Error | null = null
    try {
      if (applicationType === 'student') {
        endowmentTypes = await this.endowmentTypesModel.findEndowmentTypesByCategory(applicationType);
      } else if (applicationType === 'spouse') {
        endowmentTypes = await this.endowmentTypesModel.findEndowmentTypesByCategory(applicationType);
      } else {
        throw new Error('Invalid application type.');

        if(applicationType.length<1){
          throw new Error('No endowment was found')
        }

      }
    }catch(error){
      sentError = error.message
    }

    if(sentError){
      throw sentError
    }

    if(endowmentTypes.length<1){
      throw new Error('No endowment was found')
    }
    
    return endowmentTypes;
  }
}
