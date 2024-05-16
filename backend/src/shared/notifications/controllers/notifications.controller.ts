import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  Put,
  Query
} from '@nestjs/common'
import { NotificationsService } from '../services/notifications.service'
import { CreateNotificationDto } from '../dto/create-notification.dto'
import { UpdateNotificationDto } from '../dto/update-notification.dto'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { IUserNotification } from '../types/types'

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @Get('exists')
  async findOne(@CurrentUser() curentUser: UserFromJwt) {
    try {
      return await this.notificationsService.findAtLeastOneNotification(
        curentUser.user_id
      )
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(
    ERoles.ADMINISTRACAO,
    ERoles.ESTUDANTE,
    ERoles.DIRECAO,
    ERoles.DESIGN,
    ERoles.REPRESENTACAO,
    ERoles.MINISTERIAL,
    ERoles.DOCENTE,
    ERoles.SECRETARIA
  )
  @Get(':read')
  async findUserNotification(
    @CurrentUser() currentUser: UserFromJwt,
    @Param('read') read: string
  ): Promise<IUserNotification[]> {
    try {
      const notifications =
        await this.notificationsService.getUserNotifications(currentUser, read)

      return notifications
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(
    ERoles.ADMINISTRACAO,
    ERoles.ESTUDANTE,
    ERoles.DIRECAO,
    ERoles.DESIGN,
    ERoles.REPRESENTACAO,
    ERoles.MINISTERIAL,
    ERoles.DOCENTE,
    ERoles.SECRETARIA
  )
  @Put('read')
  async setRead(@Body() notificationId: { notificationId: number }) {
    try {
      return await this.notificationsService.setRead(notificationId)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
