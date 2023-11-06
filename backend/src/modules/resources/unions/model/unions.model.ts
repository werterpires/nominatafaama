import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { ICreateUnion, IUnion, IUpdateUnion } from '../types/types';
import { NotificationsService } from 'src/shared/notifications/services/notifications.service';
import { UserFromJwt } from 'src/shared/auth/types/types';

@Injectable()
export class UnionsModel {
  @InjectModel() private readonly knex: Knex;
  constructor(private notificationsService: NotificationsService) {}

  async createUnion(
    { union_name, union_acronym }: ICreateUnion,
    currentUser: UserFromJwt
  ): Promise<IUnion> {
    let union: IUnion | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const [union_id] = await trx('unions')
          .insert({
            union_name,
            union_acronym,
          })
          .returning('union_id');

        union = {
          union_id: union_id,
          union_name,
          union_acronym,
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
            nome: union_name,
            sigla: union_acronym,
          },
          objectUserId: null,
          oldData: null,
          table: 'Uniões',
        });
      } catch (error) {
        console.error(error);
        await trx.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Union already exists');
        } else {
          sentError = new Error(error.sqlMessage);
        }
      }
    });

    if (sentError) {
      throw sentError;
    }

    return union!;
  }

  async findUnionById(id: number): Promise<IUnion | null> {
    let union: IUnion | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('unions')
          .select('*')
          .where('union_id', '=', id);

        if (result.length < 1) {
          throw new Error('Union not found');
        }

        union = {
          union_id: result[0].union_id,
          union_name: result[0].union_name,
          union_acronym: result[0].union_acronym,
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

    return union;
  }

  async findAllUnions(): Promise<IUnion[]> {
    let unionList: IUnion[] = [];
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx.table('unions').select('*');

        unionList = results.map((row: any) => ({
          union_id: row.union_id,
          union_name: row.union_name,
          union_acronym: row.union_acronym,
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

    return unionList;
  }

  async updateUnionById(
    updateUnion: IUpdateUnion,
    currentUser: UserFromJwt
  ): Promise<IUnion> {
    let updatedUnion: IUnion | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const { union_name, union_acronym, union_id } = updateUnion;
        const oldData = await this.findUnionById(union_id);
        await trx('unions')
          .where('union_id', union_id)
          .update({ union_name, union_acronym });

        updatedUnion = await this.findUnionById(union_id);

        await trx.commit();
        await this.notificationsService.createNotification({
          notificationType: 7,
          action: 'editou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: {
            nome: union_name,
            sigla: union_acronym,
          },
          objectUserId: null,
          oldData: {
            nome: oldData?.union_name,
            sigla: oldData?.union_acronym,
          },
          table: 'Uniões',
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

    if (updatedUnion === null) {
      throw new Error('Failed to update union.');
    }

    return updatedUnion;
  }

  async deleteUnionById(id: number, currentUser: UserFromJwt): Promise<string> {
    let sentError: Error | null = null;
    let message: string = '';

    await this.knex.transaction(async (trx) => {
      try {
        const oldData = await this.findUnionById(id);
        await trx('unions').where('union_id', id).del();

        await trx.commit();
        await this.notificationsService.createNotification({
          notificationType: 7,
          action: 'apagou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: null,
          objectUserId: null,
          oldData: {
            nome: oldData?.union_name,
            sigla: oldData?.union_acronym,
          },
          table: 'Uniões',
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
