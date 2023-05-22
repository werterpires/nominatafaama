import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateAcademicFormationDto } from '../dto/create-academic-formation.dto';
import { UpdateAcademicFormationDto } from '../dto/update-academic-formation.dto';
import { AcademicFormationsService } from '../services/academic-formations.service';
import { IAcademicFormation } from '../types/types';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { UserFromJwt } from 'src/shared/auth/types/types';
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator';

@Controller('academic-formations')
export class AcademicFormationsController {
  constructor(private academicFormationsService: AcademicFormationsService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Post()
  async createAcademicFormation(@Body() input: CreateAcademicFormationDto, @CurrentUser() user: UserFromJwt) {
    const id = user.user_id;
    try {
      const academicFormation = await this.academicFormationsService.createStudentAcademicFormation(input, id);
      return academicFormation;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get(':id')
  async findAcademicFormationById(@Param('id') id: number): Promise<IAcademicFormation> {
    try {
      const academicFormation = await this.academicFormationsService.findAcademicFormationById(id);
      if (!academicFormation) {
        throw new NotFoundException(`Academic formation with id ${id} not found.`);
      }
      return academicFormation;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('student/')
  async findStudentAcademicFormationsByPersonId(@CurrentUser() user: UserFromJwt): Promise<IAcademicFormation[]> {
    try {
      const user_id = user.user_id
      const academicFormations = await this.academicFormationsService.findStudentAcademicFormationByPersonId(user_id);
      if (!academicFormations) {
        throw new NotFoundException(`No academic formations found for user with id ${user_id}.`);
      }
      return academicFormations;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('spouse/')
  async findSpouseAcademicFormationsByPersonId(@CurrentUser() user: UserFromJwt): Promise<IAcademicFormation[]> {
    try {
      const user_id = user.user_id
      const academicFormations = await this.academicFormationsService.findSpouseAcademicFormationByPersonId(user_id);
      if (!academicFormations) {
        throw new NotFoundException(`No academic formations found for user with id ${user_id}.`);
      }
      return academicFormations;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO)
  @Get()
  async findAllAcademicFormations(): Promise<IAcademicFormation[]> {
    try {
      const academicFormations = await this.academicFormationsService.findAllAcademicFormations();
      return academicFormations;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Put(':id')
  async updateAcademicFormationById(
    @Param('id') id: number,
    @Body() input: UpdateAcademicFormationDto,
  ): Promise<IAcademicFormation> {
    try {
      const updatedAcademicFormation = await this.academicFormationsService.updateAcademicFormationById(id, input);
      return updatedAcademicFormation;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO)
  @Delete(':id')
  async deleteAcademicFormationById(@Param('id') id: number) {
    try {
      const message = await this.academicFormationsService.deleteAcademicFormationById(id);
      return { message };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
