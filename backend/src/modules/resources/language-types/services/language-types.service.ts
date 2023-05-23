import { Injectable } from '@nestjs/common';
import { LanguageTypesModel } from '../model/language-types.model';
import { CreateLanguageTypeDto } from '../dto/create-language-type.dto';
import { ILanguageType, ICreateLanguageType, IUpdateLanguageType } from '../types/types';

@Injectable()
export class LanguageTypesService {
  constructor(private languageTypesModel: LanguageTypesModel) {}

  async createLanguageType(dto: CreateLanguageTypeDto): Promise<ILanguageType> {
    try {
      const languageType: ICreateLanguageType = {
        language: dto.language,
      };

      const newLanguageType = await this.languageTypesModel.createLanguageType(languageType);
      return newLanguageType;
    } catch (error) {
      throw error;
    }
  }

  async findLanguageTypeById(id: number): Promise<ILanguageType> {
    try {
      const languageType = await this.languageTypesModel.findLanguageTypeById(id);
      return languageType as ILanguageType;
    } catch (error) {
      throw new Error(`Failed to find language type with id ${id}: ${error.message}`);
    }
  }

  async findAllLanguageTypes(): Promise<ILanguageType[]> {
    try {
      const languageTypes = await this.languageTypesModel.findAllLanguageTypes();
      return languageTypes;
    } catch (error) {
      throw error;
    }
  }

  async updateLanguageTypeById(input: IUpdateLanguageType): Promise<ILanguageType> {
    let updatedLanguageType: ILanguageType | null = null;
    let sentError: Error | null = null;

    try {
      updatedLanguageType = await this.languageTypesModel.updateLanguageTypeById(input);
    } catch (error) {
      sentError = new Error(error.message);
    }

    if (sentError !== null) {
      throw sentError;
    }

    if (updatedLanguageType === null) {
      throw new Error('Failed to update language type.');
    }

    return updatedLanguageType;
  }

  async deleteLanguageTypeById(id: number): Promise<string> {
    try {
      const message = await this.languageTypesModel.deleteLanguageTypeById(id);
      return message;
    } catch (error) {
      throw error;
    }
  }
}
