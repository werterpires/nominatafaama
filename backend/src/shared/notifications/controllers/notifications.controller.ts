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
} from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/shared/auth/types/types';
import { IUserNotification } from '../types/types';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Get()
  findAll() {
    return this.notificationsService.findAll();
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
  @Get()
  async findUserNotification(
    @CurrentUser() currentUser: UserFromJwt
  ): Promise<IUserNotification[]> {
    try {
      const notifications =
        await this.notificationsService.getUserNotifications(currentUser);

      return notifications;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Put('read')
  async setRead(@Body() notificationId: { notificationId: number }) {
    try {
      return await this.notificationsService.setRead(notificationId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto
  ) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
