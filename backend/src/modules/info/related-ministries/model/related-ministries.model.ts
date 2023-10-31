import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import {
  ICreateRelatedMinistry,
  IRelatedMinistry,
  IUpdateRelatedMinistry,
} from '../types/types';
import { NotificationsService } from 'src/shared/notifications/services/notifications.service';
import { UserFromJwt } from 'src/shared/auth/types/types';

@Injectable()
export class RelatedMinistriesModel {
  @InjectModel() private readonly knex: Knex;
  constructor(private notificationsService: NotificationsService) {}

  async createRelatedMinistry(
    createRelatedMinistryData: ICreateRelatedMinistry,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      const {
        person_id,
        ministry_type_id,
        priority,
        related_ministry_approved,
      } = createRelatedMinistryData;

      await this.knex('related_ministries')
        .insert({
          person_id,
          ministry_type_id,
          priority,
          related_ministry_approved,
        })
        .returning('related_ministry_id');

      const personUndOthers = await this.knex('people')

        .leftJoin(
          'related_ministries',
          'people.person_id',
          'related_ministries.person_id'
        )
        .leftJoin(
          'ministry_types',
          'related_ministries.ministry_type_id',
          'ministry_types.ministry_type_id'
        )
        .select('people.name', 'ministry_types.ministry_type_name')
        .where('people.person_id', person_id)
        .andWhere('ministry_types.ministry_type_id', '=', ministry_type_id)
        .first();

      await this.notificationsService.createNotification({
        action: 'inseriu',
        agent_name: currentUser.name,
        agentUserId: currentUser.user_id,
        newData: {
          ministerio: personUndOthers?.ministry_type_name,
          prioridade: priority,
          pessoa: personUndOthers?.name,
        },
        notificationType: 4,
        objectUserId: currentUser.user_id,
        oldData: null,
        table: 'Ministérios de interesse',
      });
    } catch (error) {
      console.error(error);

      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Related ministry already exists');
      } else {
        throw new Error(error.sqlMessage);
      }
    }

    return true;
  }

  async findRelatedMinistryById(id: number): Promise<IRelatedMinistry> {
    let relatedMinistry: IRelatedMinistry | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('related_ministries')
          .first('related_ministries.*', 'ministry_types.ministry_type_name')
          .leftJoin(
            'ministry_types',
            'related_ministries.ministry_type_id',
            'ministry_types.ministry_type_id'
          )
          .where('related_ministry_id', '=', id);

        if (!result) {
          throw new Error('Related ministry not found');
        }

        relatedMinistry = {
          related_ministry_id: result.related_ministry_id,
          person_id: result.person_id,
          ministry_type_id: result.ministry_type_id,
          priority: result.priority,
          related_ministry_approved: result.related_ministry_approved,
          ministry_type_name: result.ministry_type_name,
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

    if (relatedMinistry == null) {
      throw new Error('Related ministry not found');
    }

    return relatedMinistry;
  }

  async findAllRelatedMinistries(): Promise<IRelatedMinistry[]> {
    let relatedMinistriesList: IRelatedMinistry[] = [];
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('related_ministries')
          .select('related_ministries.*', 'ministry_types.ministry_type_name')
          .leftJoin(
            'ministry_types',
            'related_ministries.ministry_type_id',
            'ministry_types.ministry_type_id'
          );

        relatedMinistriesList = results.map((row: any) => ({
          related_ministry_id: row.related_ministry_id,
          person_id: row.person_id,
          ministry_type_id: row.ministry_type_id,
          priority: row.priority,
          related_ministry_approved: row.related_ministry_approved,
          ministry_type_name: row.ministry_type_name,
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

    return relatedMinistriesList;
  }

  async findAllNotApprovedPersonIds(): Promise<{ person_id: number }[] | null> {
    let personIds: { person_id: number }[] | null = null;
    let sentError: Error | null = null;

    try {
      const studentResult = await this.knex
        .table('related_ministries')
        .join('users', 'users.person_id', 'related_ministries.person_id')
        .select('users.person_id')
        .whereNull('related_ministry_approved');

      const spouseResult = await this.knex
        .table('related_ministries')
        .join('spouses', 'spouses.person_id', 'related_ministries.person_id')
        .join('students', 'students.student_id', 'spouses.student_id')
        .select('students.person_id')
        .whereNull('related_ministries.related_ministry_approved');

      personIds = [...studentResult, ...spouseResult].map((row) => ({
        person_id: row.person_id,
      }));
    } catch (error) {
      console.error('Erro capturado na model: ', error);
      sentError = new Error(error.message);
    }

    return personIds;
  }

  async findRelatedMinistriesByPersonId(
    personId: number
  ): Promise<IRelatedMinistry[]> {
    let relatedMinistriesList: IRelatedMinistry[] = [];
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const existingRelatedMinistries = await trx('related_ministries')
          .select('person_id')
          .where('person_id', personId)
          .first();

        if (existingRelatedMinistries) {
          const results = await trx
            .table('related_ministries')
            .select('related_ministries.*', 'ministry_types.ministry_type_name')
            .leftJoin(
              'ministry_types',
              'related_ministries.ministry_type_id',
              'ministry_types.ministry_type_id'
            )
            .where('related_ministries.person_id', '=', personId);

          relatedMinistriesList = results.map((row: any) => ({
            related_ministry_id: row.related_ministry_id,
            person_id: row.person_id,
            ministry_type_id: row.ministry_type_id,
            priority: row.priority,
            related_ministry_approved: row.related_ministry_approved,
            ministry_type_name: row.ministry_type_name,
            created_at: row.created_at,
            updated_at: row.updated_at,
          }));

          await trx.commit();
        }
      } catch (error) {
        console.error(error);
        await trx.rollback();
        sentError = new Error(error.sqlMessage);
      }
    });

    if (sentError) {
      throw sentError;
    }

    return relatedMinistriesList;
  }

  async findApprovedRelatedMinistriesByPersonId(
    personId: number
  ): Promise<IRelatedMinistry[]> {
    let relatedMinistriesList: IRelatedMinistry[] = [];
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const existingRelatedMinistries = await trx('related_ministries')
          .select('person_id')
          .where('person_id', personId)
          .andWhere('related_ministry_approved', true)
          .first();

        if (existingRelatedMinistries) {
          const results = await trx
            .table('related_ministries')
            .select('related_ministries.*', 'ministry_types.ministry_type_name')
            .leftJoin(
              'ministry_types',
              'related_ministries.ministry_type_id',
              'ministry_types.ministry_type_id'
            )
            .where('related_ministries.person_id', '=', personId)
            .andWhere('related_ministry_approved', true);

          relatedMinistriesList = results.map((row: any) => ({
            related_ministry_id: row.related_ministry_id,
            person_id: row.person_id,
            ministry_type_id: row.ministry_type_id,
            priority: row.priority,
            related_ministry_approved: row.related_ministry_approved,
            ministry_type_name: row.ministry_type_name,
            created_at: row.created_at,
            updated_at: row.updated_at,
          }));

          await trx.commit();
        }
      } catch (error) {
        console.error(error);
        await trx.rollback();
        sentError = new Error(error.sqlMessage);
      }
    });

    if (sentError) {
      throw sentError;
    }

    return relatedMinistriesList;
  }

  async updateRelatedMinistryById(
    updateRelatedMinistry: IUpdateRelatedMinistry,
    currentUser: UserFromJwt
  ): Promise<number> {
    let updatedRelatedMinistry: number | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const {
          related_ministry_id,
          person_id,
          ministry_type_id,
          priority,
          related_ministry_approved,
        } = updateRelatedMinistry;

        let approved = await trx('related_ministries')
          .leftJoin(
            'ministry_types',
            'related_ministries.ministry_type_id',
            'ministry_types.ministry_type_id'
          )
          .leftJoin(
            'people',
            'people.person_id',
            'related_ministries.person_id'
          )
          .first('*')
          .where('related_ministry_id', related_ministry_id);

        if (approved.related_ministry_approved == true) {
          throw new Error('Registro já aprovado');
        }

        updatedRelatedMinistry = await trx('related_ministries')
          .where('related_ministry_id', related_ministry_id)
          .update({
            person_id,
            ministry_type_id,
            priority,
            related_ministry_approved,
          });

        await trx.commit();

        const personUndOthers = await this.knex('people')

          .leftJoin(
            'related_ministries',
            'people.person_id',
            'related_ministries.person_id'
          )
          .leftJoin(
            'ministry_types',
            'related_ministries.ministry_type_id',
            'ministry_types.ministry_type_id'
          )
          .select('people.name', 'ministry_types.ministry_type_name')
          .where('people.person_id', person_id)
          .andWhere('ministry_types.ministry_type_id', '=', ministry_type_id)
          .first();

        await this.notificationsService.createNotification({
          action: 'editou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: {
            ministerio: personUndOthers?.ministry_type_name,
            prioridade: priority,
            pessoa: personUndOthers?.name,
          },
          notificationType: 4,
          objectUserId: currentUser.user_id,
          oldData: {
            ministerio: approved?.ministry_type_name,
            prioridade: approved.priority,
            pessoa: approved?.name,
          },
          table: 'Ministérios de interesse',
        });
      } catch (error) {
        await trx.rollback();
        sentError = new Error(error.message);
      }
    });

    if (sentError) {
      throw sentError;
    }

    if (updatedRelatedMinistry == null) {
      throw new Error('Related ministry not found');
    }

    return updatedRelatedMinistry;
  }

  async deleteRelatedMinistryById(
    id: number,
    currentUser: UserFromJwt
  ): Promise<string> {
    let sentError: Error | null = null;
    let message: string = '';

    await this.knex.transaction(async (trx) => {
      try {
        let approved = await trx('related_ministries')
          .leftJoin(
            'ministry_types',
            'related_ministries.ministry_type_id',
            'ministry_types.ministry_type_id'
          )
          .leftJoin(
            'people',
            'people.person_id',
            'related_ministries.person_id'
          )
          .first('*')
          .where('related_ministry_id', id);

        if (!approved) {
          throw new Error('Related ministry not found');
        }

        if (approved.related_ministry_approved == true) {
          throw new Error('Registro já aprovado');
        }
        await trx('related_ministries').where('related_ministry_id', id).del();

        await trx.commit();
        await this.notificationsService.createNotification({
          action: 'apagou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: null,
          notificationType: 4,
          objectUserId: currentUser.user_id,
          oldData: {
            ministerio: approved?.ministry_type_name,
            prioridade: approved.priority,
            pessoa: approved?.name,
          },
          table: 'Ministérios de interesse',
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

    message = 'Related ministry deleted successfully';
    return message;
  }
}
