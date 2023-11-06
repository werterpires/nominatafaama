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
import { IPublication } from '../types/types';
import { CreatePublicationDto } from '../dto/create-publication.dto';
import { PublicationsService } from '../services/publications.service';
import { UpdatePublicationDto } from '../dto/update-publication.dto';

@Controller('publications')
export class PublicationsController {
  constructor(private publicationsService: PublicationsService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Post(':personType')
  async createPublication(
    @Body() input: CreatePublicationDto,
    @CurrentUser() currentUser: UserFromJwt,
    @Param('personType') personType: string
  ) {
    try {
      const user_id = currentUser.user_id;
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.');
      }
      const publication = await this.publicationsService.createPublication(
        input,
        user_id,
        personType,
        currentUser
      );
      return publication;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('person/:personType')
  async findPublicationsByPersonId(
    @CurrentUser() user: UserFromJwt,
    @Param('personType') personType: string
  ): Promise<IPublication[]> {
    try {
      const user_id = user.user_id;
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.');
      }
      const publications =
        await this.publicationsService.findPublicationsByPersonId(
          user_id,
          personType
        );

      if (!publications) {
        throw new NotFoundException(
          `No publications found for person with id fornecido.`
        );
      }
      return publications;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get(':id')
  async findPublicationById(@Param('id') id: number): Promise<IPublication> {
    try {
      const publication = await this.publicationsService.findPublicationById(
        id
      );
      if (!publication) {
        throw new NotFoundException(`No publication found with id ${id}.`);
      }
      return publication;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE, ERoles.SECRETARIA)
  @Get()
  async findAllPublications(): Promise<IPublication[]> {
    try {
      const publications = await this.publicationsService.findAllPublications();
      return publications;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Put()
  async updatePublicationById(
    @Body() input: UpdatePublicationDto,
    @CurrentUser() currentUser: UserFromJwt
  ): Promise<IPublication> {
    try {
      const updatedPublication =
        await this.publicationsService.updatePublicationById(
          input,
          currentUser
        );
      return updatedPublication;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Delete(':id')
  async deletePublicationById(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const message = await this.publicationsService.deletePublicationById(
        id,
        currentUser
      );
      return { message };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
