import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import {
  ICreateNotification,
  INotification,
  IUserNotification,
} from '../types/types';

@Injectable()
export class NotificationsModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createNotification(
    createNotificationData: ICreateNotification
  ): Promise<boolean> {
    let ok: boolean = false;
    await this.knex.transaction(async (trx) => {
      try {
        const {
          action,
          agentUserId,
          objectUserId,
          newData,
          notificationType,
          oldData,
          table,
          notificationText,
          notifiedUserIds,
          read,
          sent,
        } = createNotificationData;

        const [notificationId] = await trx('notifications').insert(
          {
            agent_user_id: agentUserId,
            action,
            table,
            old_data: oldData,
            new_data: newData,
            Object_user_id: objectUserId,
            notification_type: notificationType,
          },
          'notification_id'
        );

        if (Array.isArray(notificationText)) {
          for (let i = 0; i < notifiedUserIds.length - 1; i++) {
            await trx('users_notifications').insert({
              sent,
              read,
              notification_text: notificationText[0],
              notified_user_id: notifiedUserIds[i],
              notification_id: notificationId,
            });
          }

          await trx('users_notifications').insert({
            sent,
            read,
            notification_text: notificationText[1],
            notified_user_id: notifiedUserIds[notifiedUserIds.length - 1],
            notification_id: notificationId,
          });
        } else {
          for (let notifiedUserId of notifiedUserIds) {
            await trx('users_notifications').insert({
              sent,
              read,
              notification_text: notificationText,
              notified_user_id: notifiedUserId,
              notification_id: notificationId,
            });
          }
        }

        await trx.commit();
        ok = true;
      } catch (error) {
        console.error(error);
        await trx.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
          throw new Error('Notification already exists');
        } else {
          throw new Error(error.sqlMessage);
        }
      }
    });
    return ok;
  }

  async findNameByUserId(userId: number): Promise<{ name: string } | null> {
    try {
      const result = await this.knex
        .table('users')
        .leftJoin('people', 'users.person_id', 'people.person_id')
        .where('user_id', userId)
        .select('name')
        .first();

      if (!result) {
        throw new Error('User not found');
      }

      return { name: result.name };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async findUserIdsByRoles(roles: string[]): Promise<number[]> {
    try {
      const userIds = await this.knex
        .select('users.user_id')
        .from('users')
        .leftJoin('users_roles', 'users.user_id', 'users_roles.user_id')
        .leftJoin('roles', 'users_roles.role_id', 'roles.role_id')
        .whereIn('roles.role_name', roles)
        .andWhere('user_approved', true);

      if (userIds.length === 0) {
        throw new Error('Users not found');
      }

      return userIds.map((user) => user.user_id);
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async findUserNotifications(
    userId: number,
    read: boolean
  ): Promise<IUserNotification[]> {
    try {
      const trx = await this.knex.transaction();

      const notifications = await trx
        .table('users_notifications')
        .where('notified_user_id', '=', userId)
        .andWhere('read', '=', read)
        .leftJoin(
          'notifications',
          'users_notifications.notification_id',
          'notifications.notification_id'
        )
        .select('users_notifications.*', 'notifications.notification_type');

      await trx.commit();

      return notifications;
    } catch (error) {
      console.error(error);
      throw new Error(error.sqlMessage);
    }
  }
  async setRead(userNotificationId: number): Promise<boolean> {
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const read = await trx('users_notifications')
          .where('user_notification_id', userNotificationId)
          .first('read');

        await trx('users_notifications')
          .where('user_notification_id', userNotificationId)
          .update({
            read: !read.read,
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

    return true!;
  }

  // async findUserNotifications(userId: number): Promise<IUserNotification[]> {
  //   let notifications: IUserNotification[] = [];
  //   let sentError: Error | null = null;

  //   await this.knex.transaction(async (trx) => {
  //     try {
  //       notifications = await trx
  //         .table('users_notifications')
  //         .where('notified_user_id', '=', userId)
  //         .leftJoin(
  //           'notifications',
  //           'users_notifications.notification_id',
  //           'notifications.notification_id'
  //         )
  //         .select('users_notifications.*', 'notifications.notification_type');

  //       await trx.commit();
  //     } catch (error) {
  //       console.error(error);
  //       sentError = new Error(error.sqlMessage);
  //       await trx.rollback();
  //     }
  //   });

  //   if (sentError) {
  //     throw sentError;
  //   }

  //   return notifications;
  // }

  // async findApprovedCoursesByPersonId(personId: number): Promise<ICourse[]> {
  //   let courseList: ICourse[] = [];
  //   let sentError: Error | null = null;

  //   await this.knex.transaction(async (trx) => {
  //     try {
  //       courseList = await trx
  //         .table('courses')
  //         .where('person_id', '=', personId)
  //         .andWhere('course_approved', '=', true)
  //         .select('*');

  //       await trx.commit();
  //     } catch (error) {
  //       console.error(error);
  //       sentError = new Error(error.sqlMessage);
  //       await trx.rollback();
  //     }
  //   });

  //   if (sentError) {
  //     throw sentError;
  //   }

  //   return courseList;
  // }

  // async findAllCourses(): Promise<ICourse[]> {
  //   let courseList: ICourse[] = [];
  //   let sentError: Error | null = null;

  //   await this.knex.transaction(async (trx) => {
  //     try {
  //       courseList = await trx.table('courses').select('*');

  //       await trx.commit();
  //     } catch (error) {
  //       console.error(error);
  //       sentError = new Error(error.sqlMessage);
  //       await trx.rollback();
  //     }
  //   });

  //   if (sentError) {
  //     throw sentError;
  //   }

  //   return courseList;
  // }

  // async findAllNotApprovedPersonIds(): Promise<{ person_id: number }[] | null> {
  //   let personIds: { person_id: number }[] | null = null;
  //   let sentError: Error | null = null;

  //   try {
  //     const studentResult = await this.knex
  //       .table('courses')
  //       .join('users', 'users.person_id', 'courses.person_id')
  //       .select('users.person_id')
  //       .whereNull('course_approved');

  //     const spouseResult = await this.knex
  //       .table('courses')
  //       .join('spouses', 'spouses.person_id', 'courses.person_id')
  //       .join('students', 'students.student_id', 'spouses.student_id')
  //       .select('students.person_id')
  //       .whereNull('courses.course_approved');

  //     personIds = [...studentResult, ...spouseResult].map((row) => ({
  //       person_id: row.person_id,
  //     }));
  //   } catch (error) {
  //     console.error('Erro capturado na model: ', error);
  //     sentError = new Error(error.message);
  //   }

  //   return personIds;
  // }

  // async updateCourseById(updateCourse: IUpdateCourse): Promise<ICourse> {
  //   let updatedCourse: ICourse | null = null;
  //   let sentError: Error | null = null;

  //   await this.knex.transaction(async (trx) => {
  //     try {
  //       const {
  //         course_id,
  //         course_area,
  //         institution,
  //         begin_date,
  //         conclusion_date,
  //         person_id,
  //         course_approved,
  //       } = updateCourse;

  //       let approved = await trx('courses')
  //         .first('course_approved')
  //         .where('course_id', course_id);

  //       if (approved.course_approved == true) {
  //         throw new Error('Registro já aprovado');
  //       }

  //       await trx('courses').where('course_id', course_id).update({
  //         course_area,
  //         institution,
  //         begin_date,
  //         conclusion_date,
  //         person_id,
  //         course_approved,
  //       });

  //       await trx.commit();

  //       updatedCourse = await this.findCourseById(course_id);
  //     } catch (error) {
  //       console.error(error);
  //       await trx.rollback();
  //       sentError = new Error(error.message);
  //     }
  //   });

  //   if (sentError) {
  //     throw sentError;
  //   }

  //   return updatedCourse!;
  // }

  // async deleteCourseById(id: number): Promise<string> {
  //   let sentError: Error | null = null;
  //   let message: string = '';

  //   await this.knex.transaction(async (trx) => {
  //     try {
  //       const existingCourse = await trx('courses')
  //         .select('course_id')
  //         .where('course_id', id)
  //         .first();

  //       if (!existingCourse) {
  //         throw new Error('Course not found');
  //       }

  //       let approved = await trx('courses')
  //         .first('course_approved')
  //         .where('course_id', id);

  //       if (approved.course_approved == true) {
  //         throw new Error('Registro já aprovado');
  //       }

  //       await trx('courses').where('course_id', id).del();

  //       await trx.commit();
  //     } catch (error) {
  //       console.error(error);
  //       await trx.rollback();
  //       sentError = new Error(error.message);
  //     }
  //   });

  //   if (sentError) {
  //     throw sentError;
  //   }

  //   message = 'Course deleted successfully.';
  //   return message;
  // }
}
