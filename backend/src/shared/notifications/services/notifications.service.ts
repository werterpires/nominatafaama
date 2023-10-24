import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import {
  ICreateNotification,
  INotificationData,
  IUserNotification,
} from '../types/types';
import { ApprovedBy } from 'src/modules/users/hz_maps/users.maps';
import { NotificationsModel } from '../model/notifications.model';
import { UserFromJwt } from 'src/shared/auth/types/types';

@Injectable()
export class NotificationsService {
  constructor(private notificationsModel: NotificationsModel) {}
  async createNotification(
    notificationData: INotificationData
  ): Promise<boolean> {
    try {
      let createdNotification: boolean = false;
      if (notificationData.notificationType === 1) {
        const createNotification = await this.createNotificationTypeOne(
          notificationData
        );
        createdNotification = await this.notificationsModel.createNotification(
          createNotification
        ); // Correção aqui
      }

      return createdNotification;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createNotificationTypeOne(
    notificationData: INotificationData
  ): Promise<ICreateNotification> {
    try {
      if (notificationData.newData === null) {
        throw new Error('newData is null');
      }

      const supRoles: string[] = [];

      const rolesArrays: string[][] = notificationData.newData['papeis'].map(
        (role) => ApprovedBy.get(role.role_name) ?? []
      );

      if (rolesArrays.length > 0) {
        supRoles.push(
          ...rolesArrays.reduce((commonRoles, currentRoles) =>
            commonRoles.filter((role) => currentRoles.includes(role))
          )
        );
      }

      const notifiedUsersIds = await this.notificationsModel.findUserIdsByRoles(
        supRoles
      );

      const newDataToText: string = Object.entries(notificationData.newData)
        .map(([prop, value]) => {
          if (prop !== 'papeis') {
            return `${prop}: ${value}`;
          } else if (prop === 'papeis' && Array.isArray(value)) {
            return `${prop}: ${value
              .map((valueB) => valueB.role_name)
              .join(', ')}`;
          }
        })
        .join(', ');

      return {
        agentUserId: notificationData.agentUserId,
        notificationType: notificationData.notificationType,
        action: notificationData.action,
        table: notificationData.table,
        oldData: notificationData.oldData,
        newData: notificationData.newData,
        objectUserId: notificationData.objectUserId,
        sent: false,
        read: false,
        notificationText: `O usuário ${notificationData.agent_name} se cadastrou no sistema usando os seguintes dados: ${newDataToText}`,
        notifiedUserIds: notifiedUsersIds,
      };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  getUserNameByUserId(userId: number) {
    try {
    } catch (error) {}
  }

  async getUserNotifications(
    currentUser: UserFromJwt,
    read: string | undefined
  ): Promise<IUserNotification[]> {
    let notifications: IUserNotification[] = [];
    console.log(read);
    try {
      if (read == undefined || read == 'false') {
        notifications = await this.notificationsModel.findUserNotifications(
          currentUser.user_id,
          false
        );
      } else if (read == 'true') {
        notifications = await this.notificationsModel.findUserNotifications(
          currentUser.user_id,
          true
        );
      }
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message);
    }
    return notifications;
  }

  async setRead(notificationId: { notificationId: number }) {
    try {
      await this.notificationsModel.setRead(notificationId.notificationId);
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
