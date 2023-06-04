import { Injectable } from '@nestjs/common'
import { CreatePreviousMarriageDto } from '../dto/create-previous-marriage.dto'
import { UpdatePreviousMarriageDto } from '../dto/update-previous-marriage.dto'
import {
  ICreatePreviousMarriage,
  IPreviousMarriage,
  IUpdatePreviousMarriage,
} from '../types/types'
import { PreviousMarriagesModel } from '../model/previous-marriage.model'
import { StudentsModel } from 'src/modules/students/model/students.model'

@Injectable()
export class PreviousMarriagesService {
  constructor(
    private previousMarriagesModel: PreviousMarriagesModel,
    private studentModel: StudentsModel,
  ) {}

  async createPreviousMarriage(
    dto: CreatePreviousMarriageDto,
    user_id: number,
  ): Promise<IPreviousMarriage> {
    try {
      const { student_id } = await this.studentModel.findStudentByUserId(
        user_id,
      )
      const createPreviousMarriageData: ICreatePreviousMarriage = {
        marriage_end_date: new Date(dto.marriage_end_date),
        previous_marriage_approved: null,
        student_id: student_id,
      }
      const newPreviousMarriage =
        await this.previousMarriagesModel.createPreviousMarriage(
          createPreviousMarriageData,
        )
      return newPreviousMarriage
    } catch (error) {
      throw error
    }
  }

  async findPreviousMarriageById(
    id: number,
  ): Promise<IPreviousMarriage | null> {
    try {
      const previousMarriage =
        await this.previousMarriagesModel.findPreviousMarriageById(id)
      return previousMarriage
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar o casamento prévio com o ID ${id}: ${error.message}`,
      )
    }
  }

  async findPreviousMarriagesByStudentId(
    user_id: number,
  ): Promise<IPreviousMarriage[] | null> {
    try {
      const { student_id } = await this.studentModel.findStudentByUserId(
        user_id,
      )
      const previousMarriages =
        await this.previousMarriagesModel.findPreviousMarriagesByStudentId(
          student_id,
        )
      return previousMarriages
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar casamentos prévios para o estudante com o ID fornecido: ${error.message}`,
      )
    }
  }

  async findAllPreviousMarriages(): Promise<IPreviousMarriage[]> {
    try {
      const allPreviousMarriages =
        await this.previousMarriagesModel.findAllPreviousMarriages()
      return allPreviousMarriages
    } catch (error) {
      throw error
    }
  }

  async updatePreviousMarriageById(
    dto: UpdatePreviousMarriageDto,
  ): Promise<IPreviousMarriage> {
    try {
      const updatePreviousMarriageData: IUpdatePreviousMarriage = {
        ...dto,
        marriage_end_date: new Date(dto.marriage_end_date),
        previous_marriage_approved: null,
      }

      const updatedPreviousMarriage =
        await this.previousMarriagesModel.updatePreviousMarriageById(
          updatePreviousMarriageData,
        )
      return updatedPreviousMarriage
    } catch (error) {
      throw error
    }
  }

  async deletePreviousMarriageById(id: number): Promise<string> {
    try {
      await this.previousMarriagesModel.deletePreviousMarriageById(id)
      return 'Casamento prévio deletado com sucesso.'
    } catch (error) {
      throw error
    }
  }
}
