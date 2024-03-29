import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import {
  IAcademicDegree,
  ICreateAcademicDegree,
  IUpdateAcademicDegree,
} from '../types/types';
import { NotificationsService } from 'src/shared/notifications/services/notifications.service';
import { UserFromJwt } from 'src/shared/auth/types/types';

@Injectable()
export class AcademicDegreesModel {
  @InjectModel() private readonly knex: Knex;
  constructor(private notificationsService: NotificationsService) {}

  async createAcademicDegree(
    { degree_name }: ICreateAcademicDegree,
    currentUser: UserFromJwt
  ): Promise<IAcademicDegree> {
    let academicDegree: IAcademicDegree | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const [degree_id] = await trx('academic_degrees')
          .insert({
            degree_name,
          })
          .returning('degree_id');

        academicDegree = {
          degree_id: degree_id,
          degree_name,
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
            grau: degree_name,
          },
          objectUserId: null,
          oldData: null,
          table: 'Graus acadêmicos',
        });
      } catch (error) {
        console.error(error);
        await trx.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Academic Degree type already exists');
        } else {
          sentError = new Error(error.sqlMessage);
        }
      }
    });

    if (sentError) {
      throw sentError;
    }

    return academicDegree!;
  }

  async findAcademicDegreeById(id: number): Promise<IAcademicDegree | null> {
    let academicDegree: IAcademicDegree | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('academic_degrees')
          .select('*')
          .where('degree_id', '=', id);

        if (result.length < 1) {
          throw new Error('Academic Degree not found');
        }

        academicDegree = {
          degree_id: result[0].degree_id,
          degree_name: result[0].degree_name,
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

    return academicDegree;
  }

  async findAllAcademicDegrees(): Promise<IAcademicDegree[]> {
    let academicDegreesList: IAcademicDegree[] = [];
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx.table('academic_degrees').select('*');

        academicDegreesList = results.map((row: any) => ({
          degree_id: row.degree_id,
          degree_name: row.degree_name,
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

    return academicDegreesList;
  }

  async updateAcademicDegreeById(
    updateAcademicDegree: IUpdateAcademicDegree,
    currentUser: UserFromJwt
  ): Promise<IAcademicDegree> {
    let updatedAcademicDegree: IAcademicDegree | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const { degree_name } = updateAcademicDegree;
        const { degree_id } = updateAcademicDegree;

        const oldData = await this.findAcademicDegreeById(degree_id);

        await trx('academic_degrees')
          .where('degree_id', degree_id)
          .update({ degree_name });

        updatedAcademicDegree = await this.findAcademicDegreeById(degree_id);

        await trx.commit();
        await this.notificationsService.createNotification({
          notificationType: 7,
          action: 'editou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: {
            grau: degree_name,
          },
          objectUserId: null,
          oldData: {
            grau: oldData?.degree_name,
          },
          table: 'Graus acadêmicos',
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

    if (updatedAcademicDegree === null) {
      throw new Error('Não foi possível atualizar o grau acadêmico.');
    }

    return updatedAcademicDegree;
  }

  async deleteAcademicDegreeById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    let sentError: Error | null = null;
    let message: string = '';

    await this.knex.transaction(async (trx) => {
      try {
        const oldData = await this.findAcademicDegreeById(id);
        await trx('academic_degrees').where('degree_id', id).del();

        await trx.commit();
        await this.notificationsService.createNotification({
          notificationType: 7,
          action: 'apagou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: null,
          objectUserId: null,
          oldData: {
            grau: oldData?.degree_name,
          },
          table: 'Graus acadêmicos',
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

    message = 'Academic Degree deletado com sucesso.';
    return message;
  }
}
