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
import { AssociationsService } from '../services/associations.service';
import { CreateAssociationDto } from '../dto/create-association.dto';
import { UpdateAssociationDto } from '../dto/update-association.dto';
import { IsPublic } from 'src/shared/auth/decorators/is-public.decorator';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator';
import { UserFromJwt } from 'src/shared/auth/types/types';
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator';

@Controller('associations')
export class AssociationsController {
  constructor(private readonly associationsService: AssociationsService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Post()
  async createAssociation(
    @Body() input: CreateAssociationDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const association = await this.associationsService.createAssociation(
        input,
        currentUser
      );
      return association;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Get('associations/:id')
  async getAssociationById(@Param('id') id: number) {
    try {
      const association = await this.associationsService.findAssociationById(
        id
      );
      if (!association) {
        throw new NotFoundException(`Association with id ${id} not found.`);
      }
      return association;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @IsPublic()
  @Get()
  async findAllAssociations() {
    return await this.associationsService.findAllAssociations();
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Put()
  async updateAssociation(
    @Body() input: UpdateAssociationDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const updatedAssociation =
        await this.associationsService.updateAssociationById(
          input,
          currentUser
        );
      return updatedAssociation;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Delete(':id')
  async deleteAssociationById(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const message = await this.associationsService.deleteAssociationById(
        id,
        currentUser
      );
      return { message };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
