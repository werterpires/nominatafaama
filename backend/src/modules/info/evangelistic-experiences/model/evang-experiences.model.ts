import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { ICreateEvangelisticExperience, IEvangelisticExperience, IUpdateEvangelisticExperience } from '../types/types';

@Injectable()
export class EvangelisticExperiencesModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createEvangelisticExperience(createEvangelisticExperienceData: ICreateEvangelisticExperience): Promise<IEvangelisticExperience> {
    let evangelisticExperience: IEvangelisticExperience | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const { person_id, evang_exp_type_id, project, place, exp_begin_date, exp_end_date } = createEvangelisticExperienceData;

        const [result] = await trx('evangelistic_experiences').insert({
          person_id,
          evang_exp_type_id,
          evang_exp_approved: false,
          project, 
          place, 
          exp_begin_date, 
          exp_end_date,

        });

        evangelisticExperience = {
          evang_exp_id: result,
          person_id,
          evang_exp_type_id,
          evang_exp_approved: false,
          created_at: new Date(),
          updated_at: new Date(),
          project,
          place,
          exp_begin_date,
          exp_end_date,
          evang_exp_type: project
        };

        await trx.commit();
      } catch (error) {
        await trx.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Evangelistic Experience already exists');
        } else {
          sentError = new Error(error.sqlMessage);
        }
      }
    });

    if (sentError) {
      throw sentError;
    }

    return evangelisticExperience!;
  }

  async findEvangelisticExperienceById(id: number): Promise<IEvangelisticExperience | null> {
    let evangelisticExperience: IEvangelisticExperience | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('evangelistic_experiences')
          .first('evangelistic_experiences.*', 'evangelistic_experiences_types.*')
          .leftJoin('evang_exp_types', 'evang_exp_types.evang_exp_type_id', 'evangelistic_experiences.evang_exp_type_id')
          .where('evang_exp_id', '=', id);

        if (result.length < 1) {
          throw new Error('Evangelistic Experience not found');
        }

        evangelisticExperience = {
          evang_exp_id: result.evang_exp_id,
          person_id: result.person_id,
          evang_exp_type_id: result.evang_exp_type_id,
          evang_exp_approved: result.evang_exp_approved,
          created_at: result.created_at,
          updated_at: result.updated_at,
          project: result.project,
          place: result.place,
          exp_begin_date: result.exp_begin_date,
          exp_end_date: result.exp_end_date,
          evang_exp_type: result.evang_exp_type
        };

        await trx.commit();
      } catch (error) {
        sentError = new Error(error.message);
        await trx.rollback();
        throw error;
      }
    });

    if (sentError) {
      throw sentError;
    }

    return evangelisticExperience;
  }

  async findAllEvangelisticExperiences(): Promise<IEvangelisticExperience[]> {
    let evangelisticExperiencesList: IEvangelisticExperience[] = [];
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx.table('evangelistic_experiences')
        .select('evangelistic_experiences.*','evang_exp_types.*');

        evangelisticExperiencesList = results.map((row: any) => ({
          evang_exp_id: row.evang_exp_id,
          person_id: row.person_id,
          evang_exp_type_id: row.evang_exp_type_id,
          evang_exp_approved: row.evang_exp_approved,
          created_at: row.created_at,
          updated_at: row.updated_at,
          project:row.project,
          place:row.place,
          exp_end_date:row.exp_end_date,
          exp_begin_date: row.exp_begin_date,
          evang_exp_type: row.evang_exp_type
        }));

        await trx.commit();
      } catch (error) {
        sentError = new Error(error.sqlMessage);
        await trx.rollback();
      }
    });

    if (sentError) {
      throw sentError;
    }

    return evangelisticExperiencesList;
  }

  async findEvangelisticExperiencesByPersonId(personId: number): Promise<IEvangelisticExperience[]> {
    let evangelisticExperiencesList: IEvangelisticExperience[] = [];
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('evangelistic_experiences')
          .select('evangelistc_experiences.*', 'evang_exp_types.*')
          .where('person_id', '=', personId);

        evangelisticExperiencesList = results.map((row: any) => ({
          evang_exp_id: row.evang_exp_id,
          person_id: row.person_id,
          evang_exp_type_id: row.evang_exp_type_id,
          evang_exp_approved: row.evang_exp_approved,
          created_at: row.created_at,
          updated_at: row.updated_at,
          project:row.project,
          place:row.place,
          exp_end_date:row.exp_end_date,
          exp_begin_date: row.exp_begin_date,
          evang_exp_type: row.evang_exp_type

        }));

        await trx.commit();
      } catch (error) {
        sentError = new Error(error.sqlMessage);
        await trx.rollback();
      }
    });

    if (sentError) {
      throw sentError;
    }

    return evangelisticExperiencesList;
  }

  async updateEvangelisticExperienceById(updateEvangelisticExperience: IUpdateEvangelisticExperience): Promise<IEvangelisticExperience> {
    let updatedEvangelisticExperience: IEvangelisticExperience | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const { evang_exp_id, evang_exp_type_id, exp_begin_date, place, project, exp_end_date, person_id} = updateEvangelisticExperience;

        await trx('evangelistic_experiences')
          .where('evang_exp_id', evang_exp_id)
          .update({
            evang_exp_type_id, 
            exp_begin_date, 
            place, 
            project, 
            exp_end_date, 
            person_id
          });

        updatedEvangelisticExperience = await this.findEvangelisticExperienceById(evang_exp_id);

        await trx.commit();
      } catch (error) {
        sentError = new Error(error.message);
        await trx.rollback();
      }
    });

    if (sentError) {
      throw sentError;
    }

    if (!updatedEvangelisticExperience) {
      throw new Error('Evangelistic Experience not found');
    }

    return updatedEvangelisticExperience;
  }

  async deleteEvangelisticExperienceById(id: number): Promise<string> {
    let sentError: Error | null = null;
    let message: string = '';

    await this.knex.transaction(async (trx) => {
      try {
        const existingExperience = await trx('evangelistic_experiences')
          .select('evang_exp_id')
          .where('evang_exp_id', id)
          .first();

        if (!existingExperience) {
          throw new Error('Evangelistic Experience not found');
        }

        await trx('evangelistic_experiences').where('evang_exp_id', id).del();

        await trx.commit();
      } catch (error) {
        sentError = new Error(error.message);
        await trx.rollback();
      }
    });

    if (sentError) {
      throw sentError;
    }

    message = 'Evangelistic Experience deleted successfully.';
    return message;
  }
}
