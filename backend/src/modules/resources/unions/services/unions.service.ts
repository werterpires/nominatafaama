import { Injectable } from '@nestjs/common';
import { UnionsModel } from '../model/unions.model';
import { CreateUnionDto } from '../dto/create-union.dto';
import { ICreateUnion, IUnion, IUpdateUnion } from '../types/types';
import { UserFromJwt } from 'src/shared/auth/types/types';

@Injectable()
export class UnionsService {
  constructor(private unionsModel: UnionsModel) {}

  async createUnion(
    dto: CreateUnionDto,
    currentUser: UserFromJwt
  ): Promise<IUnion> {
    try {
      const union: ICreateUnion = {
        union_name: dto.union_name,
        union_acronym: dto.union_acronym,
      };

      const newUnion = await this.unionsModel.createUnion(union, currentUser);
      return newUnion;
    } catch (error) {
      throw error;
    }
  }

  async findUnionById(id: number): Promise<IUnion> {
    try {
      const union = await this.unionsModel.findUnionById(id);
      return union as IUnion;
    } catch (error) {
      throw new Error(`Failed to find union with id ${id}: ${error.message}`);
    }
  }

  async findAllUnions(): Promise<IUnion[]> {
    try {
      const unions = await this.unionsModel.findAllUnions();
      return unions;
    } catch (error) {
      throw error;
    }
  }

  async updateUnionById(
    input: IUpdateUnion,
    currentUser: UserFromJwt
  ): Promise<IUnion> {
    let updatedUnion: IUnion | null = null;
    let sentError: Error | null = null;

    try {
      updatedUnion = await this.unionsModel.updateUnionById(input, currentUser);
    } catch (error) {
      sentError = new Error(error.message);
    }

    if (sentError !== null) {
      throw sentError;
    }

    if (updatedUnion === null) {
      throw new Error('Failed to update union');
    }

    return updatedUnion;
  }

  async deleteUnionById(id: number, currentUser: UserFromJwt): Promise<string> {
    try {
      const message = await this.unionsModel.deleteUnionById(id, currentUser);
      return message;
    } catch (error) {
      throw error;
    }
  }
}
