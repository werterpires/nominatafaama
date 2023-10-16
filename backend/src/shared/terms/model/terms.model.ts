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

    return terms;
  }

  async signTerms(roles: number[], userId: number) {
    let sentError: Error | null = null;
    await this.knex.transaction(async (trx) => {
      try {
        const terms = await trx
          .table('terms_users')
          .select('terms_users.term_user_id')
          .leftJoin('terms', 'terms_users.term_id', 'terms.term_id')
          .whereIn('terms.role_id', roles)
          .andWhere('terms_users.user_id', userId)
          .andWhere('terms_users.unsign_date', null);
        const today = new Date();
        if (terms && terms.length > 0) {
          const signaturesIds: number[] = terms.map(
            (term) => term.term_user_id
          );

          await trx
            .table('terms_users')
            .update('unsign_date', today)
            .whereIn('term_user_id', signaturesIds);
        }

        const termsToSign = await trx
          .table('terms')
          .select(['terms.term_id'])
          .whereIn('terms.role_id', roles)
          .andWhere('terms.active', true)
          .andWhere('terms.end_date', null);

        let inserts;
        if (termsToSign && termsToSign.length > 0) {
          inserts = termsToSign.map((term) => {
            let insert = {
              user_id: userId,
              term_id: term.term_id,
              sign_date: today,
            };
            return insert;
          });

          await trx.table('terms_users').insert(inserts);

          console.log(termsToSign, inserts);
        }

        await trx.commit();

        await trx.commit();
      } catch (error) {
        console.error(error);
        sentError = new Error(error.message);
        await trx.rollback();
        throw error;
      }
    });
  }
}
