import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { ICreateDirectVacancy } from '../types/types';
import { IHiringField } from 'src/modules/nominatas/types/types';
import { error } from 'console';

@Injectable()
export class VacanciesModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createDirectVacancy(
    createDirectVacancy: ICreateDirectVacancy
  ): Promise<boolean> {
    let directVacancy: ICreateDirectVacancy | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const {
          title,
          description,
          field_id,
          student_id,
          accept,
          approved,
          deadline,
          hiring_status_id,
        } = createDirectVacancy;

        const [vacancy_id] = await trx('vacancies')
          .insert({
            title,
            description,
            field_id,
          })
          .returning('vacancy_id');

        const [vacancy_student_id] = await trx('vacancies_students')
          .insert({ vacancy_id, student_id })
          .returning('vacancy_student_id');

        const [invite_id] = await trx('invites').insert({
          vacancy_student_id,
          accept,
          approved,
          deadline,
        });

        console.log(hiring_status_id, student_id);

        await trx('students')
          .update({
            hiring_status_id,
          })
          .where('student_id', student_id);

        await trx.commit();
      } catch (error) {
        console.log('aaaaaa:', error);

        await trx.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Vaga já existe');
        } else {
          sentError = new Error(error.sqlMessage);
        }
      }
    });

    if (sentError) {
      console.error(
        'Erro capturado na createDirectVacancy na VacanciesModel:',
        sentError
      );
      throw sentError;
    }

    return true;
  }
}
