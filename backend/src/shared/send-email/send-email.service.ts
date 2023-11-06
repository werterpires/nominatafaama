import { Injectable } from '@nestjs/common'
import { CreateSendEmailDto } from './dto/create-send-email.dto'
import { UpdateSendEmailDto } from './dto/update-send-email.dto'
import * as cron from 'node-cron'
import { NotificationsModel } from '../notifications/model/notifications.model'
import {
  IUserNotification,
  IcompleteNotification
} from '../notifications/types/types'
import * as Nodemailer from 'nodemailer'

@Injectable()
export class SendEmailService {
  constructor(private notificationsModel: NotificationsModel) {
    this.sendNotifications.start
    this.removeNotifications.start
  }

  sendNotifications = cron.schedule('0 0 10,13,16,19 * * *', async () => {
    try {
      console.log(new Date())
      const notSentNotifications =
        await this.notificationsModel.findUserSentNotifications(false)

      const orderedNotSentNotifications = notSentNotifications.sort(
        this.invertNotifications
      )

      const notifiedUsers = orderedNotSentNotifications
        .filter(
          (notification, index, self) =>
            index ===
            self.findIndex(
              (t) => t.notified_user_id === notification.notified_user_id
            )
        )
        .map((notification) => {
          return {
            id: notification.notified_user_id,
            email: notification.principal_email
          }
        })

      const notificationsTypes = orderedNotSentNotifications
        .filter(
          (notification, index, self) =>
            index ===
            self.findIndex(
              (t) => t.notification_type === notification.notification_type
            )
        )
        .map((notification) => notification.notification_type)

      let emailText = ''
      let notificationsToSend: IUserNotification[] = []
      let userNotificationsIds: number[] = []
      let toSentNotifications: number[] = []
      notifiedUsers.forEach((user) => {
        notificationsToSend = orderedNotSentNotifications.filter(
          (notifications) => {
            return notifications.notified_user_id === user.id
          }
        )

        notificationsTypes.forEach((type) => {
          notificationsToSend.forEach((notification) => {
            if (notification.notification_type === type) {
              emailText =
                emailText +
                `
${notification.notification_text}`
              userNotificationsIds.push(notification.user_notification_id)
            }
          })
          emailText =
            emailText +
            `
					`
        })

        let sent = this.sendEmail(user.email, emailText)
        if (sent) {
          toSentNotifications.push(...userNotificationsIds)
        }
        emailText = ''
        userNotificationsIds = []
      })

      await this.notificationsModel.setSent(toSentNotifications)
    } catch (error) {}
  })

  removeNotifications = cron.schedule('0 0 15 * * *', async () => {
    try {
      await this.notificationsModel.deleteNotification()
    } catch (error) {}
  })

  sendEmail(userEmail: string, emailText: string) {
    try {
      const transporter = Nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'nominata@faama.edu.br',
          pass: 'mzmoqfnurluqtxtv'
        }
      })
      const mailOptions = {
        from: 'Nominata FAAMA <nominata@faama.edu.br>',
        to: userEmail,
        subject: 'Notificações Nomianta',
        text: `Notificações`,
        html: `
    		<head>
    		<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100&display=swap" rel="stylesheet">
    		</head>
    		<div style="background-color: #202c3d; color: white; font-family: 'Poppins', sans-serif; padding: 20px; border-radius: 10px">
    			<h1 style="text-align: center; text-transform: uppercase">Notificações Nominata</h1>
    			<p>Algumas ações executadas no sistema de Nominatas da Faama podem ser de seu interesse.</p> </hr>
    			<span>${emailText}</span> </hr>

    		</div>`
      }
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error('Erro ao enviar email: ', error)
          return false
        } else {
          console.log('Email enviado:', info.response)
          return true
        }
      })

      return true
    } catch (error) {
      console.log('erro ao enviar email:', error)
      throw error
    }
  }

  invertNotifications(
    a: IcompleteNotification,
    b: IcompleteNotification
  ): number {
    // Ordenar por tipo de notificação
    if (a.notification_type < b.notification_type) {
      return -1
    }
    if (a.notification_type > b.notification_type) {
      return 1
    }

    // Ordenar por agent_user_id
    if (a.agent_user_id < b.agent_user_id) {
      return -1
    }
    if (a.agent_user_id > b.agent_user_id) {
      return 1
    }

    // Ordenar por object_user_id
    if (a.object_user_id < b.object_user_id) {
      return -1
    }
    if (a.object_user_id > b.object_user_id) {
      return 1
    }

    // Ordenar por table
    if (a.table < b.table) {
      return -1
    }
    if (a.table > b.table) {
      return 1
    }

    // Ordenar por action
    if (a.action < b.action) {
      return -1
    }
    if (a.action > b.action) {
      return 1
    }

    return 0
  }

  findAll() {
    return `This action returns all sendEmail`
  }

  findOne(id: number) {
    return `This action returns a #${id} sendEmail`
  }

  update(id: number, updateSendEmailDto: UpdateSendEmailDto) {
    return `This action updates a #${id} sendEmail`
  }

  remove(id: number) {
    return `This action removes a #${id} sendEmail`
  }
}
