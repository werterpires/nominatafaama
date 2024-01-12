import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  ICreateNotification,
  INotification,
  IUserNotification,
  IcompleteNotification
} from '../types/types'

@Injectable()
export class NotificationsModel {
  @InjectModel() private readonly knex: Knex
  constructor() {}

  async createNotification(
    createNotificationData: ICreateNotification
  ): Promise<boolean> {
    let ok: boolean = false
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
          sent
        } = createNotificationData

        const [notificationId] = await trx('notifications').insert(
          {
            agent_user_id: agentUserId,
            action,
            table,
            old_data: oldData,
            new_data: newData,
            Object_user_id: objectUserId,
            notification_type: notificationType
          },
          'notification_id'
        )

        if (Array.isArray(notificationText)) {
          for (let i = 0; i < notifiedUserIds.length - 1; i++) {
            await trx('users_notifications').insert({
              sent,
              read,
              notification_text: notificationText[0],
              notified_user_id: notifiedUserIds[i],
              notification_id: notificationId
            })
          }

          await trx('users_notifications').insert({
            sent,
            read,
            notification_text: notificationText[1],
            notified_user_id: notifiedUserIds[notifiedUserIds.length - 1],
            notification_id: notificationId
          })
        } else {
          for (let notifiedUserId of notifiedUserIds) {
            await trx('users_notifications').insert({
              sent,
              read,
              notification_text: notificationText,
              notified_user_id: notifiedUserId,
              notification_id: notificationId
            })
          }
        }

        await trx.commit()
        ok = true
      } catch (error) {
        console.error(error)
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          throw new Error('Notification already exists')
        } else {
          throw new Error(error.sqlMessage)
        }
      }
    })
    return ok
  }

  async findNameByUserId(userId: number): Promise<{ name: string } | null> {
    try {
      const result = await this.knex
        .table('users')
        .leftJoin('people', 'users.person_id', 'people.person_id')
        .where('user_id', userId)
        .select('name')
        .first()

      if (!result) {
        throw new Error('User not found')
      }

      return { name: result.name }
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
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
        .andWhere('user_approved', true)

      if (userIds.length === 0) {
        throw new Error('Users not found')
      }

      return userIds.map((user) => user.user_id)
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  async findUserNotifications(
    userId: number,
    read: boolean
  ): Promise<IUserNotification[]> {
    try {
      const trx = await this.knex.transaction()

      const notifications = await trx
        .table('users_notifications')
        .where('notified_user_id', '=', userId)
        .andWhere('read', '=', read)
        .leftJoin(
          'notifications',
          'users_notifications.notification_id',
          'notifications.notification_id'
        )
        .select('users_notifications.*', 'notifications.notification_type')
        .orderBy('users_notifications.created_at', 'desc')

      await trx.commit()

      return notifications
    } catch (error) {
      console.error(error)
      throw new Error(error.sqlMessage)
    }
  }

  async findUserSentNotifications(
    sent: boolean
  ): Promise<IcompleteNotification[]> {
    try {
      const notifications = await this.knex
        .table('users_notifications')
        .andWhere('sent', '=', sent)
        .leftJoin(
          'notifications',
          'users_notifications.notification_id',
          'notifications.notification_id'
        )
        .leftJoin(
          'users',
          'users_notifications.notified_user_id',
          'users.user_id'
        )
        .leftJoin('people', 'users.person_id', 'people.person_id')
        .select(
          'users_notifications.*',
          'notifications.*',
          'users.principal_email',
          'people.name'
        )
        .orderBy('users_notifications.created_at', 'asc')

      return notifications
    } catch (error) {
      console.error(error)
      throw new Error(error.sqlMessage)
    }
  }
  async setRead(userNotificationId: number): Promise<boolean> {
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const read = await trx('users_notifications')
          .where('user_notification_id', userNotificationId)
          .first('read')

        await trx('users_notifications')
          .where('user_notification_id', userNotificationId)
          .update({
            read: !read.read
          })

        await trx.commit()
      } catch (error) {
        console.error(error)
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    return true!
  }

  async setSent(userNotificationId: number[]): Promise<boolean> {
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        await trx('users_notifications')
          .whereIn('user_notification_id', userNotificationId)
          .update({
            sent: true
          })

        await trx.commit()
      } catch (error) {
        console.error(error)
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }

    return true!
  }

  async deleteNotification(): Promise<boolean> {
    try {
      this.knex.transaction(async (trx) => {
        await trx('users_notifications')
          .del()
          .where(
            'created_at',
            '<',
            this.knex.raw('DATE_SUB(NOW(), INTERVAL 4 YEAR)')
          )

        await trx('notifications')
          .del()
          .where(
            'created_at',
            '<',
            this.knex.raw('DATE_SUB(NOW(), INTERVAL 4 YEAR)')
          )
      })

      return true
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }
}
