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

        const acceptedInviteWhithoutRepId = await trx('vacancies')
          .first('*')
          .leftJoin(
            'vacancies_students',
            'vacancies.vacancy_id',
            'vacancies_students.vacancy_id'
          )
          .leftJoin(
            'invites',
            'vacancies_students.vacancy_student_id',
            'invites.vacancy_student_id'
          )
          .where('vacancies_students.student_id', student_id);

        if (acceptedInviteWhithoutRepId) {
          await trx('vacancies')
            .update({
              field_id,
            })
            .where('vacancy_id', acceptedInviteWhithoutRepId.vacancy_id)
            .returning('vacancy_id');

          if (acceptedInviteWhithoutRepId.invite_id) {
            await trx('invites')
              .update({
                accept,
                approved,
                deadline,
              })
              .where('invite_id', acceptedInviteWhithoutRepId.invite_id);
          }
        } else {
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
        }

        await trx('students')
          .update({
            hiring_status_id,
          })
          .where('student_id', student_id);

        await trx.commit();
      } catch (error) {
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
