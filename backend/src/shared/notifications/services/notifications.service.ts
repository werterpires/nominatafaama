import { Injectable } from '@nestjs/common'
import { UpdateNotificationDto } from '../dto/update-notification.dto'
import {
  ICreateNotification,
  INotificationData,
  IUserNotification
} from '../types/types'
import { ApprovedBy } from 'src/modules/users/hz_maps/users.maps'
import { NotificationsModel } from '../model/notifications.model'
import { UserFromJwt } from 'src/shared/auth/types/types'
import * as cron from 'node-cron'

@Injectable()
export class NotificationsService {
  constructor(private notificationsModel: NotificationsModel) {}

  async createNotification(
    notificationData: INotificationData
  ): Promise<boolean> {
    try {
      const notificationType = notificationData.notificationType
      let createNotification: ICreateNotification

      switch (notificationType) {
        case 1:
          createNotification = await this.createNotificationTypeOne(
            notificationData
          )
          break
        case 2:
          createNotification = await this.createNotificationTypeTwo(
            notificationData
          )
          break
        case 3:
          createNotification = await this.createNotificationTypeThree(
            notificationData
          )
          break
        case 4:
          createNotification = await this.createNotificationTypeFour(
            notificationData
          )
          break
        case 5:
          createNotification = await this.createNotificationTypeFive(
            notificationData
          )
          break
        case 6:
          createNotification = await this.createNotificationTypeSix(
            notificationData
          )
          break
        case 7:
          createNotification = await this.createNotificationTypeSeven(
            notificationData
          )
          break
        case 8:
          createNotification = await this.createNotificationTypeEight(
            notificationData
          )
          break
        case 9:
          createNotification = await this.createNotificationTypeNine(
            notificationData
          )
          break
        case 10:
          createNotification = await this.createNotificationTypeTen(
            notificationData
          )
          break
        case 11:
          createNotification = await this.createNotificationTypeEleven(
            notificationData
          )
          break
        case 12:
          createNotification = await this.createNotificationTypeTwelve(
            notificationData
          )
          break
        case 13:
          createNotification = await this.createNotificationTypeThirteen(
            notificationData
          )
          break
        case 14:
          createNotification = await this.createNotificationTypeFourteen(
            notificationData
          )
          break
        case 15:
          createNotification = await this.createNotificationTypeFifteen(
            notificationData
          )
          break
        default:
          throw new Error(`Invalid notification type: ${notificationType}`)
      }

      return this.notificationsModel.createNotification(createNotification)
    } catch (error) {
      throw error
    }
  }

  // Cria notificação par ao caso de cadastro de novo usuário
  async createNotificationTypeOne(
    notificationData: INotificationData
  ): Promise<ICreateNotification> {
    try {
      if (notificationData.newData === null) {
        throw new Error('newData is null')
      }

      const supRoles: string[] = []

      const rolesArrays: string[][] = notificationData.newData['papeis'].map(
        (role) => ApprovedBy.get(role.role_name) ?? []
      )

      if (rolesArrays.length > 0) {
        supRoles.push(
          ...rolesArrays.reduce((commonRoles, currentRoles) =>
            commonRoles.filter((role) => currentRoles.includes(role))
          )
        )
      }

      const notifiedUsersIds = await this.notificationsModel.findUserIdsByRoles(
        supRoles
      )

      const newDataToText: string = Object.entries(notificationData.newData)
        .map(([prop, value]) => {
          if (prop !== 'papeis') {
            return `${prop}: ${value}`
          } else if (prop === 'papeis' && Array.isArray(value)) {
            return `${prop}: ${value
              .map((valueB) => valueB.role_name)
              .join(', ')}`
          }
        })
        .join(', ')

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
        notifiedUserIds: notifiedUsersIds
      }
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  // Cria notificação par ao caso de aprovação de novo usuário
  async createNotificationTypeTwo(
    notificationData: INotificationData
  ): Promise<ICreateNotification> {
    try {
      if (
        notificationData.newData === null ||
        notificationData.objectUserId === null
      ) {
        throw new Error('newData is null')
      }

      const supRoles: string[] = []

      const rolesArrays: string[][] = notificationData.newData['papeis'].map(
        (role) => ApprovedBy.get(role) ?? []
      )

      if (rolesArrays.length > 0) {
        supRoles.push(
          ...rolesArrays.reduce((commonRoles, currentRoles) =>
            commonRoles.filter((role) => currentRoles.includes(role))
          )
        )
      }

      let notifiedUsersIds = await this.notificationsModel.findUserIdsByRoles(
        supRoles
      )

      notifiedUsersIds.push(notificationData.objectUserId)
      notifiedUsersIds.splice(
        notifiedUsersIds.indexOf(notificationData.agentUserId),
        1
      )

      const textOne =
        notificationData.action === 'aprovou'
          ? `O usuário ${notificationData.agent_name} aprovou o usuário ${notificationData.newData['nome']}.`
          : `O usuário ${notificationData.agent_name} rejeitou ${notificationData.newData['nome']} como usuário do sistema.`
      const textTwo =
        notificationData.action === 'aprovou'
          ? `O usuário ${notificationData.agent_name} te aprovou como usuário do sistema.`
          : `Você não foi aceito como usuário do sistema.`
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
        notifiedUserIds: notifiedUsersIds
      }
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  // Cria notificação para mudanças em dados de professores
  async createNotificationTypeThree(
    notificationData: INotificationData
  ): Promise<ICreateNotification> {
    try {
      if (
        notificationData.newData === null &&
        notificationData.action !== 'apagou'
      ) {
        throw new Error('newData is null')
      }

      let notifiedUsersIds = await this.notificationsModel.findUserIdsByRoles([
        'direção',
        'ministerial'
      ])

      const index = notifiedUsersIds.indexOf(notificationData.agentUserId)
      let objectName = ''

      if (index !== -1) {
        notifiedUsersIds.splice(index, 1)
      }
      if (
        notificationData.objectUserId &&
        notificationData.objectUserId !== notificationData.agentUserId
      ) {
        notifiedUsersIds.push(notificationData.objectUserId)
        objectName = await this.getUserNameByUserId(
          notificationData.objectUserId
        )
      }

      let newDataToText: string = ''
      if (notificationData.newData) {
        newDataToText = Object.entries(notificationData.newData)
          .map(([prop, value]) => {
            if (prop === 'data_conclusao' && isNaN(value.getTime())) {
              return `${prop}: Não concluído`
            } else {
              return `${prop}: ${value}`
            }
          })
          .join(', ')
      }

      let oldDataToText: string = ''
      if (notificationData.oldData) {
        oldDataToText = Object.entries(notificationData.oldData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join(', ')
      }

      let textOne = ''
      let textTwo = ''
      if (!notificationData.objectUserId) {
        if (notificationData.action === 'inseriu') {
          textOne = `O usuário ${notificationData.agent_name} inseriu os seguintes dados de professor: ${newDataToText}`
        } else if (notificationData.action === 'editou') {
          textOne = `O usuário ${notificationData.agent_name} editou os seguintes dados de professor: de ${oldDataToText}, passou a ser ${newDataToText}`
        } else if (notificationData.action === 'apagou') {
          textOne = `O usuário ${notificationData.agent_name} excluiu os seguintes dados de professor: ${oldDataToText}`
        }
      } else if (
        notificationData.objectUserId &&
        notificationData.objectUserId !== notificationData.agentUserId
      ) {
        if (notificationData.action === 'inseriu') {
          textOne = `O usuário ${notificationData.agent_name} inseriu os seguintes dados para o professor ${objectName}: ${newDataToText}`
          textTwo = `O usuário ${notificationData.agent_name} inseriu os seguintes dados para você como professor: ${newDataToText}`
        } else if (notificationData.action === 'editou') {
          textOne = `O usuário ${notificationData.agent_name} editou os seguintes dados para o professor ${objectName}: de ${oldDataToText}, passou a ser ${newDataToText}`
          textTwo = `O usuário ${notificationData.agent_name} editou seus dados como professor: de ${oldDataToText}, passou a ser ${newDataToText}`
        } else if (notificationData.action === 'apagou') {
          textOne = `O usuário ${notificationData.agent_name} excluiu os seguintes dados de professor: ${oldDataToText}`
          textTwo = `O usuário ${notificationData.agent_name} excluiu seus dados como professor: ${oldDataToText}`
        }
      } else {
        if (notificationData.action === 'inseriu') {
          textOne = `O usuário ${notificationData.agent_name} inseriu os seguintes dados para si mesmo como professor: ${newDataToText}`
        } else if (notificationData.action === 'editou') {
          textOne = `O usuário ${notificationData.agent_name} editou os seguintes dados para si mesmo como professor: de ${oldDataToText}, passou a ser ${newDataToText}`
        } else if (notificationData.action === 'apagou') {
          textOne = `O usuário ${notificationData.agent_name} excluiu seus próprios dados de professor: ${oldDataToText}`
        }
      }

      let notificationText: string | string[]

      if (textTwo.length > 0) {
        notificationText = [textOne, textTwo]
      } else {
        notificationText = textOne
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
        notifiedUserIds: notifiedUsersIds
      }
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  //Cria notificaçção para estudante inserindo dados
  async createNotificationTypeFour(
    notificationData: INotificationData
  ): Promise<ICreateNotification> {
    try {
      if (
        (notificationData.newData === null &&
          notificationData.action !== 'apagou') ||
        !notificationData.objectUserId
      ) {
        throw new Error('There is no data to send the notification')
      }

      let notifiedUsersIds = await this.notificationsModel.findUserIdsByRoles([
        'direção',
        'ministerial'
      ])

      const index = notifiedUsersIds.indexOf(notificationData.agentUserId)
      let objectName = await this.getUserNameByUserId(
        notificationData.objectUserId
      )

      // if (notificationData.oldData && notificationData.newData) {
      //   const data = this.compareAndRemoveEqualProperties(
      //     notificationData.oldData,
      //     notificationData.newData
      //   );
      //   notificationData.oldData = data.oldData;
      //   notificationData.newData = data.newData;
      // }

      if (index !== -1) {
        notifiedUsersIds.splice(index, 1)
      }
      if (
        notificationData.objectUserId &&
        notificationData.objectUserId !== notificationData.agentUserId
      ) {
        notifiedUsersIds.push(notificationData.objectUserId)
        objectName = await this.getUserNameByUserId(
          notificationData.objectUserId
        )
      }

      let newDataToText: string = ''
      if (notificationData.newData) {
        newDataToText = Object.entries(notificationData.newData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join(', ')
      }

      let oldDataToText: string = ''
      if (notificationData.oldData) {
        oldDataToText = Object.entries(notificationData.oldData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join(', ')
      }

      let textOne = ''
      let textTwo = ''

      if (notificationData.action === 'inseriu') {
        textOne = `O usuário ${notificationData.agent_name} inseriu dados em ${notificationData.table}: ${newDataToText}`
      } else if (notificationData.action === 'editou') {
        textOne = `O usuário ${notificationData.agent_name} editou dados em ${notificationData.table}: de ${oldDataToText}, passou a ser ${newDataToText}`
        textTwo =
          notificationData.objectUserId !== notificationData.agentUserId
            ? `O Usuário ${notificationData.agent_name} editou dados em ${notificationData.table}: de ${oldDataToText}, passou a ser ${newDataToText}`
            : ''
      } else if (notificationData.action === 'apagou') {
        textOne = `O usuário ${notificationData.agent_name} excluiu dados em ${notificationData.table}: ${oldDataToText}`
      }

      let notificationText: string | string[] =
        notificationData.objectUserId !== notificationData.agentUserId
          ? [textOne, textTwo]
          : textOne

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
        notifiedUserIds: notifiedUsersIds
      }
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  //Cria notificaçção para aprovações de registros de estudante
  async createNotificationTypeFive(
    notificationData: INotificationData
  ): Promise<ICreateNotification> {
    try {
      if (notificationData.newData === null || !notificationData.objectUserId) {
        throw new Error('There is no data to send the notification')
      }

      let notifiedUsersIds = [notificationData.objectUserId]

      let objectName = await this.getUserNameByUserId(
        notificationData.objectUserId
      )

      let newDataToText: string = ''
      if (notificationData.newData) {
        newDataToText = Object.entries(notificationData.newData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join(', ')
      }

      let textOne = ''

      if (notificationData.action === 'aprovou') {
        textOne = `O usuário ${notificationData.agent_name} aprovou um de seus registros em ${notificationData.table}: ${newDataToText}`
      } else if (notificationData.action === 'desaprovou') {
        textOne = `O usuário ${notificationData.agent_name} desaprovou um de seus registros em ${notificationData.table}: ${newDataToText}`
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
        notifiedUserIds: notifiedUsersIds
      }
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  //Cria notificação para mudança no status de contratação
  async createNotificationTypeSix(
    notificationData: INotificationData
  ): Promise<ICreateNotification> {
    try {
      if (notificationData.newData === null || !notificationData.objectUserId) {
        throw new Error('There is no data to send the notification')
      }

      let notifiedUsersIds = await this.notificationsModel.findUserIdsByRoles([
        'direção',
        'ministerial'
      ])

      notifiedUsersIds.push(notificationData.objectUserId)

      let objectName = await this.getUserNameByUserId(
        notificationData.objectUserId
      )

      let newDataToText: string = Object.entries(notificationData.newData)
        .map(([prop, value]) => {
          return `${prop}: ${value}`
        })
        .join(', ')

      let textOne = ''
      let textTwo = ''

      textOne = `O usuário ${notificationData.agent_name} mudou o status de contratação de ${objectName}. A partir de agora, passa a ter os seguintes dados: ${newDataToText}`
      textTwo = `O usuário ${notificationData.agent_name} mudou seu status de contratação. A partir de agora, passa a ter os seguintes dados: ${newDataToText}.`

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
        notifiedUserIds: notifiedUsersIds
      }
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  //create notification for changes in parametrization
  async createNotificationTypeSeven(
    notificationData: INotificationData
  ): Promise<ICreateNotification> {
    try {
      if (
        notificationData.newData === null &&
        notificationData.action !== 'apagou'
      ) {
        throw new Error('There is no data to send the notification')
      }

      let notifiedUsersIds = await this.notificationsModel.findUserIdsByRoles([
        'direção',
        'ministerial'
      ])

      const index = notifiedUsersIds.indexOf(notificationData.agentUserId)

      if (index !== -1) {
        notifiedUsersIds.splice(index, 1)
      }

      // if (notificationData.oldData && notificationData.newData) {
      //   const data = this.compareAndRemoveEqualProperties(
      //     notificationData.oldData,
      //     notificationData.newData
      //   );
      //   notificationData.oldData = data.oldData;
      //   notificationData.newData = data.newData;
      // }

      let newDataToText: string = ''
      if (notificationData.newData) {
        newDataToText = Object.entries(notificationData.newData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join('; ')
      }

      let oldDataToText: string = ''
      if (notificationData.oldData) {
        oldDataToText = Object.entries(notificationData.oldData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join('; ')
      }

      let textOne = ''

      if (notificationData.action === 'inseriu') {
        textOne = `O usuário ${notificationData.agent_name} inseriu novos parâmetros em ${notificationData.table}: ${newDataToText}`
      } else if (notificationData.action === 'editou') {
        textOne = `O usuário ${notificationData.agent_name} editou parâmetros em ${notificationData.table}: de ${oldDataToText}, passou a ser ${newDataToText}`
      } else if (notificationData.action === 'apagou') {
        textOne = `O usuário ${notificationData.agent_name} apagou parâmetros em ${notificationData.table}: ${oldDataToText}`
      }

      let notificationText: string

      notificationText = textOne

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
        notifiedUserIds: notifiedUsersIds
      }
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  //create notification for changes in nominata
  async createNotificationTypeEight(
    notificationData: INotificationData
  ): Promise<ICreateNotification> {
    try {
      if (
        notificationData.newData === null &&
        notificationData.action !== 'apagou'
      ) {
        throw new Error('There is no data to send the notification')
      }

      let notifiedUsersIds = await this.notificationsModel.findUserIdsByRoles([
        'direção',
        'ministerial'
      ])

      const index = notifiedUsersIds.indexOf(notificationData.agentUserId)

      if (index !== -1) {
        notifiedUsersIds.splice(index, 1)
      }

      // if (notificationData.oldData && notificationData.newData) {
      //   const data = this.compareAndRemoveEqualProperties(
      //     notificationData.oldData,
      //     notificationData.newData
      //   );
      //   notificationData.oldData = data.oldData;
      //   notificationData.newData = data.newData;
      // }

      let newDataToText: string = ''
      if (notificationData.newData) {
        newDataToText = Object.entries(notificationData.newData)
          .map(([prop, value]) => {
            if (prop === 'nominata') {
              return `Nominata: ${value}`
            }
          })
          .join('. ')
      }

      let oldDataToText: string = ''
      if (notificationData.oldData) {
        oldDataToText = Object.entries(notificationData.oldData)
          .map(([prop, value]) => {
            if (prop === 'nominata') {
              return `Nominata: ${value}`
            }
          })
          .join('.')
      }

      let textOne = ''

      if (notificationData.action === 'inseriu') {
        textOne = `O usuário ${notificationData.agent_name} inseriu novos dados em ${notificationData.table} para a ${newDataToText}`
      } else if (notificationData.action === 'editou') {
        textOne = `O usuário ${notificationData.agent_name} editou dados em ${notificationData.table} da ${newDataToText}.`
      } else if (notificationData.action === 'apagou') {
        textOne = `O usuário ${notificationData.agent_name} apagou dados em ${notificationData.table} da ${oldDataToText}.`
      }

      let notificationText: string

      notificationText = textOne

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
        notifiedUserIds: notifiedUsersIds
      }
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  //create notifications for changes in field reps
  async createNotificationTypeNine(
    notificationData: INotificationData
  ): Promise<ICreateNotification> {
    try {
      if (
        notificationData.newData === null &&
        notificationData.action !== 'apagou'
      ) {
        throw new Error('newData is null')
      }

      let notifiedUsersIds = await this.notificationsModel.findUserIdsByRoles([
        'direção',
        'ministerial'
      ])

      const index = notifiedUsersIds.indexOf(notificationData.agentUserId)
      let objectName = ''

      if (index !== -1) {
        notifiedUsersIds.splice(index, 1)
      }

      let newDataToText: string = ''
      if (notificationData.newData) {
        newDataToText = Object.entries(notificationData.newData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join(', ')
      }

      let oldDataToText: string = ''
      if (notificationData.oldData) {
        oldDataToText = Object.entries(notificationData.oldData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join(', ')
      }

      let textOne = ''

      if (notificationData.action === 'inseriu') {
        textOne = `O usuário ${notificationData.agent_name} inseriu os seguintes dados para si mesmo como representante de campo: ${newDataToText}`
      } else if (notificationData.action === 'editou') {
        textOne = `O usuário ${notificationData.agent_name} editou os seguintes dados para si mesmo como representante de campo: de ${oldDataToText}, passou a ser ${newDataToText}`
      } else if (notificationData.action === 'apagou') {
        textOne = `O usuário ${notificationData.agent_name} excluiu seus próprios dados representante de campo: ${oldDataToText}`
      }

      let notificationText: string | string[]

      notificationText = textOne

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
        notifiedUserIds: notifiedUsersIds
      }
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  //create notification for changes in representations
  async createNotificationTypeTen(
    notificationData: INotificationData
  ): Promise<ICreateNotification> {
    try {
      if (
        notificationData.newData === null &&
        notificationData.action !== 'apagou'
      ) {
        throw new Error('newData is null')
      }

      let notifiedUsersIds = await this.notificationsModel.findUserIdsByRoles([
        'direção',
        'ministerial'
      ])

      const index = notifiedUsersIds.indexOf(notificationData.agentUserId)
      let objectName = ''

      if (index !== -1) {
        notifiedUsersIds.splice(index, 1)
      }

      let newDataToText: string = ''
      if (notificationData.newData) {
        newDataToText = Object.entries(notificationData.newData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join(', ')
      }

      let oldDataToText: string = ''
      if (notificationData.oldData) {
        oldDataToText = Object.entries(notificationData.oldData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join(', ')
      }

      let textOne = ''

      if (notificationData.action === 'inseriu') {
        textOne = `O usuário ${notificationData.agent_name} inseriu os seguintes dados em ${notificationData.table}: ${newDataToText}`
      } else if (notificationData.action === 'editou') {
        textOne = `O usuário ${notificationData.agent_name} editou os seguintes dados em ${notificationData.table}: de ${oldDataToText}, passou a ser ${newDataToText}`
      } else if (notificationData.action === 'apagou') {
        textOne = `O usuário ${notificationData.agent_name} excluiu os seguintes dados em ${notificationData.table}: ${oldDataToText}`
      }

      let notificationText: string | string[]

      notificationText = textOne

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
        notifiedUserIds: notifiedUsersIds
      }
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  //create notification for approve representations
  async createNotificationTypeEleven(
    notificationData: INotificationData
  ): Promise<ICreateNotification> {
    try {
      if (
        notificationData.newData === null ||
        notificationData.objectUserId === null
      ) {
        throw new Error('newData is null')
      }

      let notifiedUsersIds = await this.notificationsModel.findUserIdsByRoles([
        'direção',
        'ministerial'
      ])

      notifiedUsersIds.splice(
        notifiedUsersIds.indexOf(notificationData.agentUserId),
        1
      )

      notifiedUsersIds.push(notificationData.objectUserId)

      let newDataToText: string = ''
      if (notificationData.newData) {
        newDataToText = Object.entries(notificationData.newData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join(', ')
      }

      let oldDataToText: string = ''
      if (notificationData.oldData) {
        oldDataToText = Object.entries(notificationData.oldData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join(', ')
      }

      const textOne =
        notificationData.action === 'aprovou'
          ? `O usuário ${notificationData.agent_name} aprovou a seguinte representação de campo: ${newDataToText}.`
          : `O usuário ${notificationData.agent_name} rejeitou a seguinte representação de campo: ${newDataToText}.`
      const textTwo =
        notificationData.action === 'rejeitou'
          ? `O usuário ${notificationData.agent_name} aprovou sua representação de campo com os seguintes dados: ${newDataToText}.`
          : `Sua representação de campo não foi aprovada.`
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
        notifiedUserIds: notifiedUsersIds
      }
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  async createNotificationTypeTwelve(notificationData: INotificationData) {
    try {
      if (
        (notificationData.newData === null &&
          notificationData.action !== 'apagou') ||
        !notificationData.objectUserId
      ) {
        throw new Error('There is no data to send the notification')
      }

      let notifiedUsersIds = await this.notificationsModel.findUserIdsByRoles([
        'direção',
        'ministerial'
      ])

      const index = notifiedUsersIds.indexOf(notificationData.agentUserId)
      let objectName = await this.getUserNameByUserId(
        notificationData.objectUserId
      )

      if (index !== -1) {
        notifiedUsersIds.splice(index, 1)
      }

      let newDataToText: string = ''
      if (notificationData.newData) {
        newDataToText = Object.entries(notificationData.newData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join(', ')
      }

      let oldDataToText: string = ''
      if (notificationData.oldData) {
        oldDataToText = Object.entries(notificationData.oldData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join(', ')
      }

      const studentNome = await this.getUserNameByUserId(
        notificationData.objectUserId
      )

      let textOne = ''
      let textTwo = ''

      if (notificationData.action === 'inseriu') {
        textOne = `O usuário ${notificationData.agent_name} fez um chamado para o estudante ${studentNome}.`
      }

      let notificationText: string

      notificationText = textOne

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
        notifiedUserIds: notifiedUsersIds
      }
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  async createNotificationTypeThirteen(
    notificationData: INotificationData
  ): Promise<ICreateNotification> {
    try {
      if (
        notificationData.newData === null ||
        notificationData.objectUserId === null
      ) {
        throw new Error('newData is null')
      }

      let notifiedUsersIds = await this.notificationsModel.findUserIdsByRoles([
        'direção',
        'ministerial'
      ])

      const oldDAta = notificationData.oldData

      if (oldDAta) {
        const studentUserId = oldDAta['student_user_id']

        if (studentUserId) {
          notifiedUsersIds.push(studentUserId)
        }
      }

      const agentIndex = notifiedUsersIds.indexOf(notificationData.agentUserId)

      if (agentIndex !== -1) {
        notifiedUsersIds.splice(
          notifiedUsersIds.indexOf(notificationData.agentUserId),
          1
        )
      }

      notifiedUsersIds.push(notificationData.objectUserId)

      let newDataToText: string = ''
      if (notificationData.newData) {
        newDataToText = Object.entries(notificationData.newData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join(', ')
      }

      let oldDataToText: string = ''
      if (notificationData.oldData) {
        oldDataToText = Object.entries(notificationData.oldData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join(', ')
      }

      const objectName = await this.getUserNameByUserId(
        notificationData.objectUserId
      )

      const textOne =
        notificationData.action === 'aprovou'
          ? `O usuário ${notificationData.agent_name} aprovou o seguinte convite de ${objectName}: ${newDataToText}.`
          : `O usuário ${notificationData.agent_name} desaprovou o seguinte convite de ${objectName}: ${newDataToText}.`
      const textTwo =
        notificationData.action === 'aprovou'
          ? `O usuário ${notificationData.agent_name} aprovou seu convite com os seguintes dados: ${newDataToText}.`
          : `O seguinte convite que você fez foi aprovado: ${newDataToText}.`
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
        notifiedUserIds: notifiedUsersIds
      }
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  async createNotificationTypeFourteen(
    notificationData: INotificationData
  ): Promise<ICreateNotification> {
    try {
      if (
        notificationData.newData === null ||
        notificationData.objectUserId === null
      ) {
        throw new Error('newData is null')
      }

      let notifiedUsersIds = await this.notificationsModel.findUserIdsByRoles([
        'direção',
        'ministerial'
      ])

      notifiedUsersIds.splice(
        notifiedUsersIds.indexOf(notificationData.agentUserId),
        1
      )

      notifiedUsersIds.push(notificationData.objectUserId)

      let newDataToText: string = ''
      if (notificationData.newData) {
        newDataToText = Object.entries(notificationData.newData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join(', ')
      }

      let oldDataToText: string = ''
      if (notificationData.oldData) {
        oldDataToText = Object.entries(notificationData.oldData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join(', ')
      }

      const objectName = await this.getUserNameByUserId(
        notificationData.objectUserId
      )

      const textOne =
        notificationData.action === 'aceitou'
          ? `O usuário ${notificationData.agent_name} aceitou o seguinte convite de ${objectName}: ${newDataToText}.`
          : `O usuário ${notificationData.agent_name} rejeitou o seguinte convite de ${objectName}: ${newDataToText}.`
      const textTwo =
        notificationData.action === 'aceitou'
          ? `O usuário ${notificationData.agent_name} aceitou seu convite com os seguintes dados: ${newDataToText}.`
          : `O seguinte convite que você fez foi rejeitado: ${newDataToText}.`
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
        notifiedUserIds: notifiedUsersIds
      }
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  async createNotificationTypeFifteen(
    notificationData: INotificationData
  ): Promise<ICreateNotification> {
    try {
      if (
        notificationData.newData === null ||
        notificationData.objectUserId === null
      ) {
        throw new Error('newData is null')
      }

      let notifiedUsersIds = await this.notificationsModel.findUserIdsByRoles([
        'direção',
        'ministerial'
      ])

      notifiedUsersIds.push(notificationData.objectUserId)

      let newDataToText: string = ''
      if (notificationData.newData) {
        newDataToText = Object.entries(notificationData.newData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join(', ')
      }

      let oldDataToText: string = ''
      if (notificationData.oldData) {
        oldDataToText = Object.entries(notificationData.oldData)
          .map(([prop, value]) => {
            return `${prop}: ${value}`
          })
          .join(', ')
      }

      const objectName = await this.getUserNameByUserId(
        notificationData.objectUserId
      )

      const textOne = `O convite de ${objectName}: ${newDataToText} feito a ${notificationData.agent_name} recusado porque ultrapassou o tempo de expiração.`
      const textTwo = `Seu convite feito a ${notificationData.agent_name} foi recusado porque ultrapassou o tempo de expiração.`

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
        notifiedUserIds: notifiedUsersIds
      }
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  async getUserNameByUserId(userId: number): Promise<string> {
    let userName: {
      name: string
    } | null = null
    try {
      userName = await this.notificationsModel.findNameByUserId(userId)
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
    if (userName) {
      return userName.name
    } else {
      return ''
    }
  }

  async formatDate(date: Date | any) {
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    } else if (date === null || isNaN(Date.parse(date.toDateString()))) {
      return 'Data não informada'
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
  }

  compareAndRemoveEqualProperties(oldData: any, newData: any) {
    const propertiesToRemove: string[] = []

    for (const property in oldData) {
      if (
        oldData.hasOwnProperty(property) &&
        newData.hasOwnProperty(property)
      ) {
        if (oldData[property] === newData[property]) {
          propertiesToRemove.push(property)
        }
      }
    }

    propertiesToRemove.forEach((property) => {
      delete oldData[property]
      delete newData[property]
    })

    return { oldData, newData }
  }

  async formateBoolean(boolean: boolean) {
    if (boolean) {
      return 'Sim'
    } else {
      return 'Não'
    }
  }

  async getUserNotifications(
    currentUser: UserFromJwt,
    read: string | undefined
  ): Promise<IUserNotification[]> {
    let notifications: IUserNotification[] = []

    try {
      if (read == undefined || read == 'false') {
        notifications = await this.notificationsModel.findUserNotifications(
          currentUser.user_id,
          false
        )
      } else if (read == 'true') {
        notifications = await this.notificationsModel.findUserNotifications(
          currentUser.user_id,
          true
        )
      }
    } catch (error) {
      console.error(error.message)
      throw new Error(error.message)
    }
    return notifications
  }

  async setRead(notificationId: { notificationId: number }) {
    try {
      await this.notificationsModel.setRead(notificationId.notificationId)
    } catch (error) {
      console.error(error.message)
      throw new Error(error.message)
    }
  }
  async findAtLeastOneNotification(userId: number): Promise<boolean> {
    try {
      const notifications = await this.notificationsModel.findUserNotifications(
        userId,
        false
      )
      return notifications.length > 0
    } catch (error) {
      console.error(error.message)
      throw new Error(error.message)
    }
  }
}
