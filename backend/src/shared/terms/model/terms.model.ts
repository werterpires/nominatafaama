import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { ITerm } from '../types/types';

@Injectable()
export class TermsModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async findAllActiveTerms(): Promise<ITerm[]> {
    let terms: ITerm[] = [];
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        terms = await trx
          .table('terms')
          .select(['terms.*'])
          .where('terms.active', true)
          .andWhere('terms.end_date', null);

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
    console.log('Termos saindo da Model:', terms);
    return terms;
  }
}
