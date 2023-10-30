import { Injectable } from '@nestjs/common';
import { CreatePreviousMarriageDto } from '../dto/create-previous-marriage.dto';
import { UpdatePreviousMarriageDto } from '../dto/update-previous-marriage.dto';
import {
  ICreatePreviousMarriage,
  IPreviousMarriage,
  IUpdatePreviousMarriage,
} from '../types/types';
import { PreviousMarriagesModel } from '../model/previous-marriage.model';
import { StudentsModel } from 'src/modules/students/model/students.model';
import { UserFromJwt } from 'src/shared/auth/types/types';

@Injectable()
export class PreviousMarriagesService {
  constructor(
    private previousMarriagesModel: PreviousMarriagesModel,
    private studentModel: StudentsModel
  ) {}

  async createPreviousMarriage(
    dto: CreatePreviousMarriageDto,
    user_id: number,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      const student = await this.studentModel.findStudentByUserId(user_id);
      if (student == null) {
        throw new Error(
          `Não foi encontrado um estudante vinculado ao usuário om id ${user_id}.`
        );
      }

      const { student_id } = student;

      const createPreviousMarriageData: ICreatePreviousMarriage = {
        marriage_end_date: new Date(dto.marriage_end_date),
        previous_marriage_approved: null,
        student_id: student_id,
      };
      const newPreviousMarriage =
        await this.previousMarriagesModel.createPreviousMarriage(
          createPreviousMarriageData,
          currentUser
        );
      return true;
    } catch (error) {
      console.error(
        'Erro capturado no previousMarriageService createPreviousMarriage: ',
        error
      );
      throw error;
    }
  }

  async findPreviousMarriageById(
    id: number
  ): Promise<IPreviousMarriage | null> {
    try {
      const previousMarriage =
        await this.previousMarriagesModel.findPreviousMarriageById(id);
      return previousMarriage;
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar o casamento prévio com o ID ${id}: ${error.message}`
      );
    }
  }

  async findPreviousMarriagesByStudentId(
    user_id: number
  ): Promise<IPreviousMarriage[] | null> {
    try {
      const student = await this.studentModel.findStudentByUserId(user_id);
      if (student == null) {
        return null;
      }

      const { student_id } = student;
      const previousMarriages =
        await this.previousMarriagesModel.findPreviousMarriagesByStudentId(
          student_id
        );
      return previousMarriages;
    } catch (error) {
      console.error(
        'Erro capturado no previousMarriageService findPreviousMarriagesByStudentId: ',
        error
      );
      throw error;
    }
  }

  async findAllPreviousMarriages(): Promise<IPreviousMarriage[]> {
    try {
      const allPreviousMarriages =
        await this.previousMarriagesModel.findAllPreviousMarriages();
      return allPreviousMarriages;
    } catch (error) {
      throw error;
    }
  }

  async updatePreviousMarriageById(
    dto: UpdatePreviousMarriageDto
  ): Promise<IPreviousMarriage> {
    try {
      const updatePreviousMarriageData: IUpdatePreviousMarriage = {
        ...dto,
        marriage_end_date: new Date(dto.marriage_end_date),
        previous_marriage_approved: null,
      };

      const updatedPreviousMarriage =
        await this.previousMarriagesModel.updatePreviousMarriageById(
          updatePreviousMarriageData
        );
      return updatedPreviousMarriage;
    } catch (error) {
      throw error;
    }
  }

  async deletePreviousMarriageById(id: number): Promise<string> {
    try {
      await this.previousMarriagesModel.deletePreviousMarriageById(id);
      return 'Casamento prévio deletado com sucesso.';
    } catch (error) {
      throw error;
    }
  }
}
