import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import {
  ICreateHiringStatus,
  IHiringStatus,
  IUpdateHiringStatus,
} from '../types/types';
import { NotificationsService } from 'src/shared/notifications/services/notifications.service';
import { UserFromJwt } from 'src/shared/auth/types/types';

@Injectable()
export class HiringStatusModel {
  @InjectModel() private readonly knex: Knex;
  constructor(private notificationsService: NotificationsService) {}

  async createHiringStatus(
    { hiring_status_name, hiring_status_description }: ICreateHiringStatus,
    currentUser: UserFromJwt
  ): Promise<IHiringStatus> {
    let hiringStatus: IHiringStatus | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const [hiring_status_id] = await trx('hiring_status')
          .insert({
            hiring_status_name,
            hiring_status_description,
          })
          .returning('hiring_status_id');

        hiringStatus = {
          hiring_status_id: hiring_status_id,
          hiring_status_name,
          hiring_status_description,
          created_at: new Date(),
          updated_at: new Date(),
        };

        await trx.commit();
        await this.notificationsService.createNotification({
          notificationType: 7,
          action: 'inseriu',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: {
            status: hiring_status_name,
            descricao: hiring_status_description,
          },
          objectUserId: null,
          oldData: null,
          table: 'Status de contratação',
        });
      } catch (error) {
        console.error(error);
        await trx.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Status de contratação já existente.');
        } else {
          sentError = new Error(error.sqlMessage);
        }
      }
    });

    if (sentError) {
      throw sentError;
    }

    return hiringStatus!;
  }

  async findHiringStatusById(id: number): Promise<IHiringStatus | null> {
    let hiringStatus: IHiringStatus | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('hiring_status')
          .select('*')
          .where('hiring_status_id', '=', id);

        if (result.length < 1) {
          throw new Error('Status de contratação não encontrado.');
        }

        hiringStatus = {
          hiring_status_id: result[0].hiring_status_id,
          hiring_status_name: result[0].hiring_status_name,
          hiring_status_description: result[0].hiring_status_description,
          created_at: result[0].created_at,
          updated_at: result[0].updated_at,
        };

        await trx.commit();
      } catch (error) {
        console.error(error);
        sentError = new Error(error.message);
        await trx.rollback();
        throw error;
      }
    });

    if (sentError) {
      throw sentError;
    }

    return hiringStatus;
  }

  async findAllHiringStatus(): Promise<IHiringStatus[]> {
    let hiringStatusList: IHiringStatus[] = [];
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx.table('hiring_status').select('*');

        hiringStatusList = results.map((row: any) => ({
          hiring_status_id: row.hiring_status_id,
          hiring_status_name: row.hiring_status_name,
          hiring_status_description: row.hiring_status_description,
          created_at: row.created_at,
          updated_at: row.updated_at,
        }));

        await trx.commit();
      } catch (error) {
        console.error(error);
        await trx.rollback();
        sentError = new Error(error.sqlMessage);
      }
    });

    if (sentError) {
      throw sentError;
    }

    return hiringStatusList;
  }

  async updateHiringStatusById(
    updateHiringStatus: IUpdateHiringStatus,
    currentUser: UserFromJwt
  ): Promise<IHiringStatus> {
    let updatedHirignStatus: IHiringStatus | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const {
          hiring_status_name,
          hiring_status_description,
          hiring_status_id,
        } = updateHiringStatus;
        const oldData = await this.findHiringStatusById(hiring_status_id);
        await trx('hiring_status')
          .where('hiring_status_id', hiring_status_id)
          .update({ hiring_status_name, hiring_status_description });

        updatedHirignStatus = await this.findHiringStatusById(hiring_status_id);

        await trx.commit();
        await this.notificationsService.createNotification({
          notificationType: 7,
          action: 'editou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: {
            status: hiring_status_name,
            descricao: hiring_status_description,
          },
          objectUserId: null,
          oldData: {
            status: oldData?.hiring_status_name,
            descricao: oldData?.hiring_status_description,
          },
          table: 'Status de contratação',
        });
      } catch (error) {
        console.error(error);
        await trx.rollback();
        sentError = new Error(error.message);
      }
    });

    if (sentError) {
      throw sentError;
    }

    if (updatedHirignStatus === null) {
      throw new Error('Falha ao atualizar status de contratação.');
    }

    return updatedHirignStatus;
  }

  async deleteHiringStatusById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    let sentError: Error | null = null;
    let message: string = '';

    await this.knex.transaction(async (trx) => {
      try {
        const oldData = await this.findHiringStatusById(id);
        await trx('hiring_status').where('hiring_status_id', id).del();
        await trx.commit();
        await this.notificationsService.createNotification({
          notificationType: 7,
          action: 'apagou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: null,
          objectUserId: null,
          oldData: {
            status: oldData?.hiring_status_name,
            descricao: oldData?.hiring_status_description,
          },
          table: 'Status de contratação',
        });
      } catch (error) {
        console.error(error);
        sentError = new Error(error.message);
        await trx.rollback();
      }
    });

    if (sentError) {
      throw sentError;
    }

    message = 'Union deleted successfully.';
    return message;
  }
}
