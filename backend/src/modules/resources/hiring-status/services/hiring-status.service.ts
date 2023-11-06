import { Injectable } from '@nestjs/common';
import { CreateHiringStatusDto } from '../dto/create-hiring-status.dto';
import { UpdateHiringStatusDto } from '../dto/update-hiring-status.dto';
import { HiringStatusModel } from '../model/hiring-status.model';
import {
  ICreateHiringStatus,
  IHiringStatus,
  IUpdateHiringStatus,
} from '../types/types';
import { UserFromJwt } from 'src/shared/auth/types/types';

@Injectable()
export class HiringStatusService {
  constructor(private hiringStatusModel: HiringStatusModel) {}

  async createHiringStatus(
    dto: ICreateHiringStatus,
    currentUser: UserFromJwt
  ): Promise<IHiringStatus> {
    try {
      const hiringStatus: ICreateHiringStatus = {
        hiring_status_name: dto.hiring_status_name,
        hiring_status_description: dto.hiring_status_description,
      };

      const newHiringStatus = await this.hiringStatusModel.createHiringStatus(
        hiringStatus,
        currentUser
      );
      return newHiringStatus;
    } catch (error) {
      throw error;
    }
  }

  async findHiringStatusById(id: number): Promise<IHiringStatus> {
    try {
      const hiringStatus = await this.hiringStatusModel.findHiringStatusById(
        id
      );
      return hiringStatus as IHiringStatus;
    } catch (error) {
      throw new Error(
        `Failed to find hiring status with id ${id}: ${error.message}`
      );
    }
  }

  async findAllHiringStatus(): Promise<IHiringStatus[]> {
    try {
      const hiringStatuses = await this.hiringStatusModel.findAllHiringStatus();
      return hiringStatuses;
    } catch (error) {
      throw error;
    }
  }

  async updateHiringStatusById(
    input: IUpdateHiringStatus,
    currentUser: UserFromJwt
  ): Promise<IHiringStatus> {
    let updatedHiringStatus: IHiringStatus | null = null;
    let sentError: Error | null = null;

    try {
      updatedHiringStatus = await this.hiringStatusModel.updateHiringStatusById(
        input,
        currentUser
      );
    } catch (error) {
      sentError = new Error(error.message);
    }

    if (sentError !== null) {
      throw sentError;
    }

    if (updatedHiringStatus === null) {
      throw new Error('Failed to update hiring status');
    }

    return updatedHiringStatus;
  }

  async deleteHiringStatusById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    try {
      const message = await this.hiringStatusModel.deleteHiringStatusById(
        id,
        currentUser
      );
      return message;
    } catch (error) {
      throw error;
    }
  }
}
