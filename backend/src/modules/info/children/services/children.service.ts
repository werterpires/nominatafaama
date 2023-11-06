import { Injectable } from '@nestjs/common';
import { IChild, ICreateChild, IUpdateChild } from '../types/types';
import { ChildrenModel } from '../model/children.model';
import { CreateChildDto } from '../dto/create-child.dto';
import { UpdateChildDto } from '../dto/update-child.dto';
import { StudentsModel } from 'src/modules/students/model/students.model';
import { UserFromJwt } from 'src/shared/auth/types/types';

@Injectable()
export class ChildrenService {
  constructor(
    private childrenModel: ChildrenModel,
    private studentModel: StudentsModel
  ) {}

  async createChild(
    dto: CreateChildDto,
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
      const student_id = student.student_id;

      const createChildData: ICreateChild = {
        ...dto,
        child_birth_date: new Date(dto.child_birth_date),
        child_approved: null,
        student_id,
      };

      const childId = await this.childrenModel.createChild(
        createChildData,
        currentUser
      );

      return true;
    } catch (error) {
      console.error('Erro capturado no childrenService createChild: ', error);
      throw error;
    }
  }

  async findChildById(id: number): Promise<IChild | null> {
    try {
      const child = await this.childrenModel.findChildById(id);
      return child;
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar a criança com o ID ${id}: ${error.message}`
      );
    }
  }

  async findAllChildren(): Promise<IChild[]> {
    try {
      const allChildren = await this.childrenModel.findAllChildren();
      return allChildren;
    } catch (error) {
      throw error;
    }
  }

  async findAllChildrenByStudentId(user_id: number): Promise<IChild[]> {
    try {
      const student = await this.studentModel.findStudentByUserId(user_id);
      if (student == null) {
        return [];
      }
      const student_id = student.student_id;
      const allStudentChildren =
        await this.childrenModel.findChildrenByStudentId(student_id);
      return allStudentChildren;
    } catch (error) {
      console.error(
        'Erro capturado no childrenService findAllChildrenByStudentId: ',
        error
      );
      throw error;
    }
  }

  async updateChildById(
    dto: UpdateChildDto,
    currentUser: UserFromJwt
  ): Promise<IChild> {
    try {
      const updateChildData: IUpdateChild = {
        ...dto,
        child_birth_date: new Date(dto.child_birth_date),
        child_approved: null,
      };
      const childId = await this.childrenModel.updateChildById(
        updateChildData,
        currentUser
      );
      const updatedChild = await this.childrenModel.findChildById(dto.child_id);
      return updatedChild;
    } catch (error) {
      throw error;
    }
  }

  async deleteChildById(id: number, currentUser: UserFromJwt): Promise<string> {
    try {
      await this.childrenModel.deleteChildById(id, currentUser);
      return 'Criança deletada com sucesso.';
    } catch (error) {
      throw error;
    }
  }
}
