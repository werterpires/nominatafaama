import { Injectable } from '@nestjs/common';
import {
  CreateDirectVacancyDto,
  CreateVacancyDto,
} from '../dto/create-vacancy.dto';
import { UpdateVacancyDto } from '../dto/update-vacancy.dto';
import { ICreateDirectVacancy } from '../types/types';
import { VacanciesModel } from '../model/vacancies.model';

@Injectable()
export class VacanciesService {
  constructor(private vacanciesModel: VacanciesModel) {}

  async createDirectVacancy(dto: CreateDirectVacancyDto): Promise<boolean> {
    try {
      const createDirectVacancy: ICreateDirectVacancy = {
        ...dto,
        title: 'Vaga direta',
        accept: true,
        approved: true,
        deadline: new Date(),
        description: 'Vaga criada pelo time da Coordenação',
      };

      const newVacancy = await this.vacanciesModel.createDirectVacancy(
        createDirectVacancy
      );
      return newVacancy;
    } catch (error) {
      console.error(
        'erro capturado no createDirectVacancy no VacanciesService:',
        error
      );
      throw error;
    }
  }

  findAll() {
    return `This action returns all vacancies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vacancy`;
  }

  update(id: number, updateVacancyDto: UpdateVacancyDto) {
    return `This action updates a #${id} vacancy`;
  }

  remove(id: number) {
    return `This action removes a #${id} vacancy`;
  }
}
