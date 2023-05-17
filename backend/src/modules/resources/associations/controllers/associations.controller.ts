import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, NotFoundException, Put } from '@nestjs/common';
import { AssociationsService } from '../services/associations.service';
import { CreateAssociationDto } from '../dto/create-association.dto';
import { UpdateAssociationDto } from '../dto/update-association.dto';
import { IsPublic } from 'src/shared/auth/decorators/is-public.decorator';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator';

@Controller('associations')
export class AssociationsController {
  constructor(private readonly associationsService: AssociationsService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA)
@Post('associations')
async createAssociation(@Body() input: CreateAssociationDto) {
  try {
    const association = await this.associationsService.createAssociation(input);
    return association;
  } catch (error) {
    throw new InternalServerErrorException(error.message);
  }
}

@Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA)
@Get('associations/:id')
async getAssociationById(@Param('id') id: number) {
  try {
    const association = await this.associationsService.findAssociationById(id);
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

@Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA)
@Put()
async updateAssociation(@Body() input: UpdateAssociationDto) {
  try {
    const updatedAssociation = await this.associationsService.updateAssociationById(input);
    return updatedAssociation;
  } catch (error) {
    throw new InternalServerErrorException(error.message);
  }
}

@Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA)
@Delete(':id')
async deleteAssociationById(@Param('id') id: number) {
  try {
    const message = await this.associationsService.deleteAssociationById(id);
    return { message };
  } catch (error) {
    throw new InternalServerErrorException(error.message);
  }
}

}
