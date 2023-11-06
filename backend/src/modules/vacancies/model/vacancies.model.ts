import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { ICreateDirectVacancy } from '../types/types';
import { NotificationsService } from 'src/shared/notifications/services/notifications.service';
import { UserFromJwt } from 'src/shared/auth/types/types';

@Injectable()
export class VacanciesModel {
  @InjectModel() private readonly knex: Knex;
  constructor(private notificationsService: NotificationsService) {}

  async createDirectVacancy(
    createDirectVacancy: ICreateDirectVacancy,
    currentUser: UserFromJwt
  ): Promise<boolean> {
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

        let vacancy_id: number | null = null;

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
          .where('vacancies_students.student_id', student_id)
          .andWhere('vacancies.rep_id', null)
          .andWhere('invites.accept', true);

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
          [vacancy_id] = await trx('vacancies')
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

        const realVacancyId = vacancy_id
          ? vacancy_id
          : acceptedInviteWhithoutRepId.vacancy_id;

        const personAndOthers = await this.knex('vacancies')
          .leftJoin(
            'vacancies_students',
            'vacancies_students.vacancy_id',
            'vacancies.vacancy_id'
          )
          .leftJoin(
            'students',
            'students.student_id',
            'vacancies_students.student_id'
          )
          .leftJoin(
            'hiring_status',
            'students.hiring_status_id',
            'hiring_status.hiring_status_id'
          )
          .leftJoin(
            'associations',
            'associations.association_id',
            'vacancies.field_id'
          )
          .leftJoin('users', 'students.person_id', 'users.person_id')
          .first(
            'hiring_status_name',
            'associations.association_name',
            'users.user_id'
          )
          .where('vacancies.vacancy_id', realVacancyId);

        await this.notificationsService.createNotification({
          action: 'editou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: {
            titulo: title,
            descricao: description,
            campo: personAndOthers.association_name,
            situacao: personAndOthers.hiring_status_name,
          },
          notificationType: 6,
          objectUserId: personAndOthers.user_id,
          oldData: null,
          table: 'vagas',
        });
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
