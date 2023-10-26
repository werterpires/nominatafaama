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
        );
      } else if (notificationData.notificationType === 2) {
        const createNotification = await this.createNotificationTypeTwo(
          notificationData
        );
        createdNotification = await this.notificationsModel.createNotification(
          createNotification
        );
      } else if (notificationData.notificationType === 3) {
        const createNotification = await this.createNotificationTypeThree(
          notificationData
        );
        createdNotification = await this.notificationsModel.createNotification(
          createNotification
        );
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
        notificationText: [
          `O usuário ${notificationData.agent_name} se cadastrou no sistema usando os seguintes dados: ${newDataToText}`,
        ],
        notifiedUserIds: notifiedUsersIds,
      };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async createNotificationTypeTwo(
    notificationData: INotificationData
  ): Promise<ICreateNotification> {
    try {
      if (
        notificationData.newData === null ||
        notificationData.objectUserId === null
      ) {
        throw new Error('newData is null');
      }

      const supRoles: string[] = [];

      const rolesArrays: string[][] = notificationData.newData['papeis'].map(
        (role) => ApprovedBy.get(role) ?? []
      );

      if (rolesArrays.length > 0) {
        supRoles.push(
          ...rolesArrays.reduce((commonRoles, currentRoles) =>
            commonRoles.filter((role) => currentRoles.includes(role))
          )
        );
      }

      let notifiedUsersIds = await this.notificationsModel.findUserIdsByRoles(
        supRoles
      );

      notifiedUsersIds.push(notificationData.objectUserId);
      notifiedUsersIds.splice(
        notifiedUsersIds.indexOf(notificationData.agentUserId),
        1
      );

      const textOne =
        notificationData.action === 'aprovou'
          ? `O usuário ${notificationData.agent_name} aprovou o usuário ${notificationData.newData['nome']}.`
          : `O usuário ${notificationData.agent_name} rejeitou ${notificationData.newData['nome']} como usuário do sistema.`;
      const textTwo =
        notificationData.action === 'aprovou'
          ? `O usuário ${notificationData.agent_name} te aprovou como usuário do sistema.`
          : `Você não foi aceito como usuário do sistema.`;
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
        notificationText: [textOne, textTwo],
        notifiedUserIds: notifiedUsersIds,
      };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async createNotificationTypeThree(
    notificationData: INotificationData
  ): Promise<ICreateNotification> {
    try {
      if (notificationData.newData === null) {
        throw new Error('newData is null');
      }

      let notifiedUsersIds = await this.notificationsModel.findUserIdsByRoles([
        'direcao',
        'ministerial',
      ]);

      const index = notifiedUsersIds.indexOf(notificationData.agentUserId);
      let objectName = '';

      if (index !== -1) {
        notifiedUsersIds.splice(index, 1);
      }
      if (
        notificationData.objectUserId &&
        notificationData.objectUserId !== notificationData.agentUserId
      ) {
        notifiedUsersIds.push(notificationData.objectUserId);
        objectName = await this.getUserNameByUserId(
          notificationData.objectUserId
        );
      }

      const newDataToText: string = Object.entries(notificationData.newData)
        .map(([prop, value]) => {
          return `${prop}: ${value}`;
        })
        .join(', ');

      let textOne = '';
      let textTwo = '';
      if (!notificationData.objectUserId) {
        if (notificationData.action === 'inseriu') {
          textOne = `O usuário ${notificationData.agent_name} inseriu os seguintes dados de professor: ${newDataToText}`;
        }
      } else if (
        notificationData.objectUserId &&
        notificationData.objectUserId !== notificationData.agentUserId
      ) {
        if (notificationData.action === 'inseriu') {
          textOne = `O usuário ${notificationData.agent_name} inseriu os seguintes dados para o professor ${objectName}: ${newDataToText}`;
          textTwo = `O usuário ${notificationData.agent_name} inseriu os seguintes dados para você como professor: ${newDataToText}`;
        }
      } else {
        if (notificationData.action === 'inseriu') {
          textOne = `O usuário ${notificationData.agent_name} inseriu os seguintes dados para si mesmo como professor: ${newDataToText}`;
        }
      }

      let notificationText: string | string[];

      if (textTwo.length > 0) {
        notificationText = [textOne, textTwo];
      } else {
        notificationText = textOne;
      }

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
        notificationText: notificationText,
        notifiedUserIds: notifiedUsersIds,
      };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async getUserNameByUserId(userId: number): Promise<string> {
    let userName: {
      name: string;
    } | null = null;
    try {
      userName = await this.notificationsModel.findNameByUserId(userId);
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
    if (userName) {
      return userName.name;
    } else {
      return '';
    }
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
