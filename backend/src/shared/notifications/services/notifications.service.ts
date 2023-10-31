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
import { log } from 'console';

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
      } else if (notificationData.notificationType === 4) {
        const createNotification = await this.createNotificationTypeFour(
          notificationData
        );
        createdNotification = await this.notificationsModel.createNotification(
          createNotification
        );
      } else if (notificationData.notificationType === 5) {
        const createNotification = await this.createNotificationTypeFive(
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
        notificationText: `O usuário ${notificationData.agent_name} se cadastrou no sistema usando os seguintes dados: ${newDataToText}`,
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
      if (
        notificationData.newData === null &&
        notificationData.action !== 'apagou'
      ) {
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

      let newDataToText: string = '';
      if (notificationData.newData) {
        newDataToText = Object.entries(notificationData.newData)
          .map(([prop, value]) => {
            if (prop === 'data_conclusao' && isNaN(value.getTime())) {
              return `${prop}: Não concluído`;
            } else {
              return `${prop}: ${value}`;
            }
          })
          .join(', ');
      }

      let oldDataToText: string = '';
      if (notificationData.oldData) {
        oldDataToText = Object.entries(notificationData.oldData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`;
          })
          .join(', ');
      }

      let textOne = '';
      let textTwo = '';
      if (!notificationData.objectUserId) {
        if (notificationData.action === 'inseriu') {
          textOne = `O usuário ${notificationData.agent_name} inseriu os seguintes dados de professor: ${newDataToText}`;
        } else if (notificationData.action === 'editou') {
          textOne = `O usuário ${notificationData.agent_name} editou os seguintes dados de professor: de ${oldDataToText}, passou a ser ${newDataToText}`;
        } else if (notificationData.action === 'apagou') {
          textOne = `O usuário ${notificationData.agent_name} excluiu os seguintes dados de professor: ${oldDataToText}`;
        }
      } else if (
        notificationData.objectUserId &&
        notificationData.objectUserId !== notificationData.agentUserId
      ) {
        if (notificationData.action === 'inseriu') {
          textOne = `O usuário ${notificationData.agent_name} inseriu os seguintes dados para o professor ${objectName}: ${newDataToText}`;
          textTwo = `O usuário ${notificationData.agent_name} inseriu os seguintes dados para você como professor: ${newDataToText}`;
        } else if (notificationData.action === 'editou') {
          textOne = `O usuário ${notificationData.agent_name} editou os seguintes dados para o professor ${objectName}: de ${oldDataToText}, passou a ser ${newDataToText}`;
          textTwo = `O usuário ${notificationData.agent_name} editou seus dados como professor: de ${oldDataToText}, passou a ser ${newDataToText}`;
        } else if (notificationData.action === 'apagou') {
          textOne = `O usuário ${notificationData.agent_name} excluiu os seguintes dados de professor: ${oldDataToText}`;
          textTwo = `O usuário ${notificationData.agent_name} excluiu seus dados como professor: ${oldDataToText}`;
        }
      } else {
        if (notificationData.action === 'inseriu') {
          textOne = `O usuário ${notificationData.agent_name} inseriu os seguintes dados para si mesmo como professor: ${newDataToText}`;
        } else if (notificationData.action === 'editou') {
          textOne = `O usuário ${notificationData.agent_name} editou os seguintes dados para si mesmo como professor: de ${oldDataToText}, passou a ser ${newDataToText}`;
        } else if (notificationData.action === 'apagou') {
          textOne = `O usuário ${notificationData.agent_name} excluiu seus próprios dados de professor: ${oldDataToText}`;
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

  async createNotificationTypeFour(
    notificationData: INotificationData
  ): Promise<ICreateNotification> {
    try {
      if (
        (notificationData.newData === null &&
          notificationData.action !== 'apagou') ||
        !notificationData.objectUserId
      ) {
        throw new Error('There is no data to send the notification');
      }

      let notifiedUsersIds = await this.notificationsModel.findUserIdsByRoles([
        'direcao',
        'ministerial',
      ]);

      const index = notifiedUsersIds.indexOf(notificationData.agentUserId);
      let objectName = await this.getUserNameByUserId(
        notificationData.objectUserId
      );

      if (notificationData.oldData && notificationData.newData) {
        const data = this.compareAndRemoveEqualProperties(
          notificationData.oldData,
          notificationData.newData
        );
        notificationData.oldData = data.oldData;
        notificationData.newData = data.newData;
      }

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

      let newDataToText: string = '';
      if (notificationData.newData) {
        newDataToText = Object.entries(notificationData.newData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`;
          })
          .join(', ');
      }

      let oldDataToText: string = '';
      if (notificationData.oldData) {
        oldDataToText = Object.entries(notificationData.oldData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`;
          })
          .join(', ');
      }

      let textOne = '';
      let textTwo = '';

      if (notificationData.action === 'inseriu') {
        textOne = `O usuário ${notificationData.agent_name} inseriu dados em ${notificationData.table}: ${newDataToText}`;
      } else if (notificationData.action === 'editou') {
        textOne = `O usuário ${notificationData.agent_name} editou dados em ${notificationData.table}: de ${oldDataToText}, passou a ser ${newDataToText}`;
      } else if (notificationData.action === 'apagou') {
        textOne = `O usuário ${notificationData.agent_name} excluiu dados em ${notificationData.table}: ${oldDataToText}`;
      }

      let notificationText: string;

      notificationText = textOne;

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

  async createNotificationTypeFive(
    notificationData: INotificationData
  ): Promise<ICreateNotification> {
    try {
      if (notificationData.newData === null || !notificationData.objectUserId) {
        throw new Error('There is no data to send the notification');
      }

      let notifiedUsersIds = [notificationData.objectUserId];

      let objectName = await this.getUserNameByUserId(
        notificationData.objectUserId
      );

      let newDataToText: string = '';
      if (notificationData.newData) {
        newDataToText = Object.entries(notificationData.newData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`;
          })
          .join(', ');
      }

      let textOne = '';

      if (notificationData.action === 'aprovou') {
        textOne = `O usuário ${notificationData.agent_name} aprovou um de seus registros em ${notificationData.table}: ${newDataToText}`;
      } else if (notificationData.action === 'desaprovou') {
        textOne = `O usuário ${notificationData.agent_name} desaprovou um de seus registros em ${notificationData.table}: ${newDataToText}`;
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
        notificationText: textOne,
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

  async formatDate(date: Date | any) {
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    } else if (date === null || isNaN(Date.parse(date.toDateString()))) {
      return 'Data não informada';
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
  }

  compareAndRemoveEqualProperties(oldData: any, newData: any) {
    const propertiesToRemove: string[] = [];

    for (const property in oldData) {
      if (
        oldData.hasOwnProperty(property) &&
        newData.hasOwnProperty(property)
      ) {
        if (oldData[property] === newData[property]) {
          propertiesToRemove.push(property);
        }
      }
    }

    propertiesToRemove.forEach((property) => {
      delete oldData[property];
      delete newData[property];
    });

    return { oldData, newData };
  }

  async formateBoolean(boolean: boolean) {
    if (boolean) {
      return 'Sim';
    } else {
      return 'Não';
    }
  }

  async getUserNotifications(
    currentUser: UserFromJwt,
    read: string | undefined
  ): Promise<IUserNotification[]> {
    let notifications: IUserNotification[] = [];

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
