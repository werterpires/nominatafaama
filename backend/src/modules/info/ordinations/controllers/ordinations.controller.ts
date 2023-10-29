import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { UserFromJwt } from 'src/shared/auth/types/types';
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator';
import { IOrdination } from '../types/types';
import { CreateOrdinationDto } from '../dto/create-ordination.dto';
import { OrdinationsService } from '../services/ordinations.service';
import { UpdateOrdinationDto } from '../dto/update-ordination.dto';

@Controller('ordinations')
export class OrdinationsController {
  constructor(private ordinationsService: OrdinationsService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Post(':personType')
  async createOrdination(
    @Body() input: CreateOrdinationDto,
    @CurrentUser() currentUser: UserFromJwt,
    @Param('personType') personType: string
  ) {
    try {
      const user_id = currentUser.user_id;
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.');
      }
      const ordination = await this.ordinationsService.createOrdination(
        input,
        user_id,
        personType,
        currentUser
      );
      return ordination;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('person/:personType')
  async findOrdinationsByPersonId(
    @CurrentUser() user: UserFromJwt,
    @Param('personType') personType: string
  ): Promise<IOrdination[]> {
    try {
      const user_id = user.user_id;
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.');
      }
      const ordinations =
        await this.ordinationsService.findOrdinationsByPersonId(
          user_id,
          personType
        );

      if (!ordinations) {
        throw new NotFoundException(
          `No ordinations found for person with id fornecido.`
        );
      }
      return ordinations;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get(':id')
  async findOrdinationById(@Param('id') id: number): Promise<IOrdination> {
    try {
      const ordination = await this.ordinationsService.findOrdinationById(id);
      if (!ordination) {
        throw new NotFoundException(`No ordination found with id ${id}.`);
      }
      return ordination;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE, ERoles.SECRETARIA)
  @Get()
  async findAllOrdinations(): Promise<IOrdination[]> {
    try {
      const ordinations = await this.ordinationsService.findAllOrdinations();
      return ordinations;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Put()
  async updateOrdinationById(
    @Body() input: UpdateOrdinationDto
  ): Promise<IOrdination> {
    try {
      const updatedOrdination =
        await this.ordinationsService.updateOrdinationById(input);
      return updatedOrdination;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Delete(':id')
  async deleteOrdinationById(@Param('id') id: number) {
    try {
      const message = await this.ordinationsService.deleteOrdinationById(id);
      return { message };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
