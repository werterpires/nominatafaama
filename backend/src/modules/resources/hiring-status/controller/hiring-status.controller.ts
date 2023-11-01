import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { HiringStatusService } from '../services/hiring-status.service';
import { CreateHiringStatusDto } from '../dto/create-hiring-status.dto';
import { UpdateHiringStatusDto } from '../dto/update-hiring-status.dto';
import { IsPublic } from 'src/shared/auth/decorators/is-public.decorator';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator';
import { UserFromJwt } from 'src/shared/auth/types/types';
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator';

@Controller('hiring-status')
export class HiringStatusController {
  constructor(private readonly hiringStatusService: HiringStatusService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Post()
  async createHiringStatus(
    @Body() input: CreateHiringStatusDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const hiringStatus = await this.hiringStatusService.createHiringStatus(
        input,
        currentUser
      );
      return hiringStatus;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Get(':id')
  async getHiringStatusById(@Param('id') id: number) {
    try {
      const hiringStatus = await this.hiringStatusService.findHiringStatusById(
        id
      );
      if (!hiringStatus) {
        throw new NotFoundException(`Hiring Status with id ${id} not found.`);
      }
      return hiringStatus;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @IsPublic()
  @Get()
  async findAllHiringStatus() {
    return await this.hiringStatusService.findAllHiringStatus();
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Put()
  async updateHiringStatus(
    @Body() input: UpdateHiringStatusDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const updatedHiringStatus =
        await this.hiringStatusService.updateHiringStatusById(
          input,
          currentUser
        );
      return updatedHiringStatus;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Delete(':id')
  async deleteHiringStatusById(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const message = await this.hiringStatusService.deleteHiringStatusById(
        id,
        currentUser
      );
      return { message };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
