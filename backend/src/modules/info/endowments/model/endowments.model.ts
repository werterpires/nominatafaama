import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { ICreateEndowment, IEndowment, IUpdateEndowment } from '../types/types';
import { NotificationsService } from 'src/shared/notifications/services/notifications.service';
import { UserFromJwt } from 'src/shared/auth/types/types';

@Injectable()
export class EndowmentsModel {
  @InjectModel() private readonly knex: Knex;
  constructor(private notificationsService: NotificationsService) {}

  async createEndowment(
    createEndowmentData: ICreateEndowment,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      const { endowment_type_id, person_id, endowment_approved } =
        createEndowmentData;

      await this.knex('endowments')
        .insert({
          endowment_type_id,
          person_id,
          endowment_approved,
        })
        .returning('endowment_id');

      const personUndOthers = await this.knex('people')
        .leftJoin('endowments', 'people.person_id', 'endowments.person_id')
        .leftJoin(
          'endowment_types',
          'endowments.endowment_type_id',
          'endowment_types.endowment_type_id'
        )
        .where('people.person_id', person_id)
        .andWhere('endowment_types.endowment_type_id', endowment_type_id)
        .select('people.name', 'endowment_types.endowment_type_name')
        .first();

      await this.notificationsService.createNotification({
        action: 'inseriu',
        agent_name: currentUser.name,
        agentUserId: currentUser.user_id,
        newData: {
          investidura: personUndOthers.endowment_type_name,
          pessoa: personUndOthers?.name,
        },
        notificationType: 4,
        objectUserId: currentUser.user_id,
        oldData: null,
        table: 'Investiduras',
      });
    } catch (error) {
      console.error(error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Endowment already exists');
      } else {
        throw new Error(error.sqlMessage);
      }
    }

    return true;
  }

  async findEndowmentById(id: number): Promise<IEndowment> {
    let endowment: IEndowment | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('endowments')
          .first(
            'endowments.*',
            'endowment_types.endowment_type_name',
            'endowment_types.application'
          )
          .leftJoin(
            'endowment_types',
            'endowments.endowment_type_id',
            'endowment_types.endowment_type_id'
          )
          .where('endowment_id', '=', id);

        if (!result) {
          throw new Error('Endowment not found');
        }

        endowment = {
          endowment_id: result.endowment_id,
          endowment_type_id: result.endowment_type_id,
          person_id: result.person_id,
          endowment_approved: result.endowment_approved,
          endowment_type_name: result.endowment_type_name,
          application: result.application,
          created_at: result.created_at,
          updated_at: result.updated_at,
        };

        await trx.commit();
      } catch (error) {
        sentError = new Error(error.message);
        await trx.rollback();
      }
    });

    if (sentError) {
      throw sentError;
    }

    if (endowment == null) {
      throw new Error('Endowment not found');
    }

    return endowment;
  }

  async findAllEndowments(): Promise<IEndowment[]> {
    let endowmentsList: IEndowment[] = [];
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('endowments')
          .select(
            'endowments.*',
            'endowment_types.endowment_type_name',
            'endowment_types.application'
          )
          .leftJoin(
            'endowment_types',
            'endowments.endowment_type_id',
            'endowment_types.endowment_type_id'
          );

        endowmentsList = results.map((row: any) => ({
          endowment_id: row.endowment_id,
          endowment_type_id: row.endowment_type_id,
          person_id: row.person_id,
          endowment_approved: row.endowment_approved,
          endowment_type_name: row.endowment_type_name,
          application: row.application,
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

    return endowmentsList;
  }

  async findAllNotApprovedPersonIds(): Promise<{ person_id: number }[] | null> {
    let personIds: { person_id: number }[] | null = null;
    let sentError: Error | null = null;

    try {
      const studentResult = await this.knex
        .table('endowments')
        .join('users', 'users.person_id', 'endowments.person_id')
        .select('users.person_id')
        .whereNull('endowment_approved');

      const spouseResult = await this.knex
        .table('endowments')
        .join('spouses', 'spouses.person_id', 'endowments.person_id')
        .join('students', 'students.student_id', 'spouses.student_id')
        .select('students.person_id')
        .whereNull('endowments.endowment_approved');

      personIds = [...studentResult, ...spouseResult].map((row) => ({
        person_id: row.person_id,
      }));
    } catch (error) {
      console.error('Erro capturado na model: ', error);
      sentError = new Error(error.message);
    }

    return personIds;
  }

  async findEndowmentsByPersonId(personId: number): Promise<IEndowment[]> {
    let endowmentsList: IEndowment[] = [];
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('endowments')
          .select(
            'endowments.*',
            'endowment_types.endowment_type_name',
            'endowment_types.application'
          )
          .leftJoin(
            'endowment_types',
            'endowments.endowment_type_id',
            'endowment_types.endowment_type_id'
          )
          .where('endowments.person_id', '=', personId);

        endowmentsList = results.map((row: any) => ({
          endowment_id: row.endowment_id,
          endowment_type_id: row.endowment_type_id,
          person_id: row.person_id,
          endowment_approved: row.endowment_approved,
          endowment_type_name: row.endowment_type_name,
          application: row.application,
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

    return endowmentsList;
  }

  async findApprovedEndowmentsByPersonId(
    personId: number
  ): Promise<IEndowment[]> {
    let endowmentsList: IEndowment[] = [];
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('endowments')
          .select(
            'endowments.*',
            'endowment_types.endowment_type_name',
            'endowment_types.application'
          )
          .leftJoin(
            'endowment_types',
            'endowments.endowment_type_id',
            'endowment_types.endowment_type_id'
          )
          .where('endowments.person_id', '=', personId)
          .andWhere('endowments.endowment_approved', '=', true);

        endowmentsList = results.map((row: any) => ({
          endowment_id: row.endowment_id,
          endowment_type_id: row.endowment_type_id,
          person_id: row.person_id,
          endowment_approved: row.endowment_approved,
          endowment_type_name: row.endowment_type_name,
          application: row.application,
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

    return endowmentsList;
  }

  async updateEndowmentById(
    updateEndowment: IUpdateEndowment
  ): Promise<number> {
    let updatedEndowment: number | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const {
          endowment_id,
          endowment_type_id,
          person_id,
          endowment_approved,
        } = updateEndowment;

        let approved = await trx('endowments')
          .first('endowment_approved')
          .where('endowment_id', endowment_id);

        if (approved.endowment_approved == true) {
          throw new Error('Registro já aprovado');
        }

        updatedEndowment = await trx('endowments')
          .where('endowment_id', endowment_id)
          .update({
            endowment_type_id,
            person_id,
            endowment_approved,
          });

        await trx.commit();
      } catch (error) {
        await trx.rollback();
        sentError = new Error(error.message);
      }
    });

    if (sentError) {
      throw sentError;
    }

    if (updatedEndowment == null) {
      throw new Error('Endowment not found');
    }

    return updatedEndowment;
  }

  async deleteEndowmentById(id: number): Promise<string> {
    let sentError: Error | null = null;
    let message: string = '';

    await this.knex.transaction(async (trx) => {
      try {
        const existingEndowment = await trx('endowments')
          .select('endowment_id')
          .where('endowment_id', id)
          .first();

        if (!existingEndowment) {
          throw new Error('Endowment not found');
        }

        let approved = await trx('endowments')
          .first('endowment_approved')
          .where('endowment_id', id);

        if (approved.endowment_approved == true) {
          throw new Error('Registro já aprovado');
        }

        await trx('endowments').where('endowment_id', id).del();

        await trx.commit();
      } catch (error) {
        console.error(error);
        sentError = new Error(error.message);
        await trx.rollback();
      }
    });

    if (sentError) {
      throw sentError;
    }

    message = 'Endowment deleted successfully';
    return message;
  }
}
