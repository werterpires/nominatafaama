import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import {
  ICreateOrdination,
  IOrdination,
  IUpdateOrdination,
} from '../types/types';

@Injectable()
export class OrdinationsModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createOrdination(
    createOrdinationData: ICreateOrdination
  ): Promise<number> {
    let ordinationId!: number;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const { ordination_name, place, year, person_id, ordination_approved } =
          createOrdinationData;

        const [ordination_id] = await trx('ordinations')
          .insert({
            ordination_name,
            place,
            year,
            person_id,
            ordination_approved,
          })
          .returning('ordination_id');

        ordinationId = ordination_id;

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

    if (!ordinationId) {
      throw new Error('Não foi possível criar ordenação.');
    }

    return ordinationId;
  }

  async findOrdinationById(id: number): Promise<IOrdination> {
    let ordination: IOrdination | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx('ordinations')
          .first('ordinations.*')
          .where('ordinations.ordination_id', '=', id);
        if (!result) {
          throw new Error('Ordination not found');
        }

        ordination = {
          ordination_id: result.ordination_id,
          ordination_name: result.ordination_name,
          place: result.place,
          year: result.year,
          person_id: result.person_id,
          ordination_approved: result.ordination_approved,
          created_at: result.created_at,
          updated_at: result.updated_at,
        };

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

    if (ordination == null) {
      throw new Error('Ordination not found');
    }

    return ordination;
  }

  async findAllOrdinations(): Promise<IOrdination[]> {
    let ordinationsList: IOrdination[] = [];
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx('ordinations').select('ordinations.*');

        ordinationsList = results.map((row: any) => ({
          ordination_id: row.ordination_id,
          ordination_name: row.ordination_name,
          place: row.place,
          year: row.year,
          person_id: row.person_id,
          personName: row.person_name,
          ordination_approved: row.ordination_approved,
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

    return ordinationsList;
  }

  async findAllNotApprovedPersonIds(): Promise<{ person_id: number }[] | null> {
    let personIds: { person_id: number }[] | null = null;
    let sentError: Error | null = null;

    try {
      const studentResult = await this.knex
        .table('ordinations')
        .join('users', 'users.person_id', 'ordinations.person_id')
        .select('users.person_id')
        .whereNull('ordination_approved');

      const spouseResult = await this.knex
        .table('ordinations')
        .join('spouses', 'spouses.person_id', 'ordinations.person_id')
        .join('students', 'students.student_id', 'spouses.student_id')
        .select('students.person_id')
        .whereNull('ordinations.ordination_approved');

      personIds = [...studentResult, ...spouseResult].map((row) => ({
        person_id: row.person_id,
      }));
    } catch (error) {
      console.error('Erro capturado na model: ', error);
      sentError = new Error(error.message);
    }

    return personIds;
  }

  async findOrdinationsByPersonId(person_id: number): Promise<IOrdination[]> {
    let ordinationsList: IOrdination[] = [];
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx('ordinations')
          .select('ordinations.*')
          .where('ordinations.person_id', '=', person_id);

        ordinationsList = results.map((row: any) => ({
          ordination_id: row.ordination_id,
          ordination_name: row.ordination_name,
          place: row.place,
          year: row.year,
          person_id: row.person_id,
          personName: row.person_name,
          ordination_approved: row.ordination_approved,
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

    return ordinationsList;
  }

  async findApprovedOrdinationsByPersonId(
    person_id: number
  ): Promise<IOrdination[]> {
    let ordinationsList: IOrdination[] = [];
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx('ordinations')
          .select('ordinations.*')
          .where('ordinations.person_id', '=', person_id)
          .andWhere('ordinations.ordination_approved', '=', true);

        ordinationsList = results.map((row: any) => ({
          ordination_id: row.ordination_id,
          ordination_name: row.ordination_name,
          place: row.place,
          year: row.year,
          person_id: row.person_id,
          personName: row.person_name,
          ordination_approved: row.ordination_approved,
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

    return ordinationsList;
  }

  async updateOrdinationById(
    updateOrdination: IUpdateOrdination
  ): Promise<number> {
    let updatedOrdination: number | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const {
          ordination_id,
          ordination_name,
          place,
          year,
          person_id,
          ordination_approved,
        } = updateOrdination;

        let approved = await trx('ordinations')
          .first('ordination_approved')
          .where('ordination_id', ordination_id);

        if (approved.ordination_approved == true) {
          throw new Error('Registro já aprovado');
        }

        updatedOrdination = await trx('ordinations')
          .where('ordination_id', ordination_id)
          .update({
            ordination_name,
            place,
            year,
            person_id,
            ordination_approved,
          });

        await trx.commit();
      } catch (error) {
        console.error(error);
        await trx.rollback();
        sentError = new Error(error.message);
      }
    });

    if (sentError) {
      throw sentError;
    }

    if (updatedOrdination == null) {
      updatedOrdination = 0;
    }

    return updatedOrdination;
  }

  async deleteOrdinationById(id: number): Promise<string> {
    let sentError: Error | null = null;
    let message: string = '';

    await this.knex.transaction(async (trx) => {
      try {
        const existingOrdination = await trx('ordinations')
          .select('ordination_id')
          .where('ordination_id', id)
          .first();

        if (!existingOrdination) {
          throw new Error('Ordination not found');
        }

        let approved = await trx('ordinations')
          .first('ordination_approved')
          .where('ordination_id', id);

        if (approved.ordination_approved == true) {
          throw new Error('Registro já aprovado');
        }
        await trx('ordinations').where('ordination_id', id).del();

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

    message = 'Ordination deleted successfully';
    return message;
  }
}
