import { Injectable } from '@nestjs/common';
import { AcademicDegreesModel } from '../model/academic-degrees.model';
import { CreateAcademicDegreeDto } from '../dto/create-academic-degree.dto';
import { IAcademicDegree, ICreateAcademicDegree, IUpdateAcademicDegree } from '../types/types';

@Injectable()
export class AcademicDegreesService {
  constructor(private academicDegreesModel: AcademicDegreesModel){}
  async createAcademicDegree(dto: CreateAcademicDegreeDto): Promise<IAcademicDegree> {
    try {
      const maritalStatus: ICreateAcademicDegree = {
        degree_name: dto.degree_name,
      };
  
      const newAcademicDegree = await this.academicDegreesModel.createAcademicDegree(maritalStatus);
      return newAcademicDegree;
    } catch (error) {
      throw error;
    }
  }
  
  async findAcademicDegreeById(id: number): Promise<IAcademicDegree> {
    try {
      const academicDegree = await this.academicDegreesModel.findAcademicDegreeById(id);
      return academicDegree as IAcademicDegree;
    } catch (error) {
      throw new Error(`Não foi possível encontrar um grau acadêmico com id ${id}: ${error.message}`);
    }
  }
  
  async findAllAcademicDegreees(): Promise<IAcademicDegree[]> {
    try {
      const academicDegrees = await this.academicDegreesModel.findAllAcademicDegrees();
      return academicDegrees;
    } catch (error) {
      throw error;
    }
  }
  
  async updateAcademicDegreeById(input: IUpdateAcademicDegree): Promise<IAcademicDegree> {
    let updatedAcademicDegree: IAcademicDegree | null = null;
    let sentError: Error | null = null;
  
    try {
      updatedAcademicDegree = await this.academicDegreesModel.updateAcademicDegreeById(input);
    } catch (error) {
      sentError = new Error(error.message);
    }
  
    if (sentError !== null) {
      throw sentError;
    }
  
    if (updatedAcademicDegree === null) {
      throw new Error('O grau acadêmico não pôde ser atualizado.');
    }
  
    return updatedAcademicDegree;
  }
  
  async deleteAcademicDegreeById(id: number): Promise<string> {
    try {
      const message = await this.academicDegreesModel.deleteAcademicDegreeById(id);
      return message;
    } catch (error) {
      throw error;
    }
  }
  
}
