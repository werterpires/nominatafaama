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
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { AcademicDegreesService } from '../services/academic-degrees.service';
import { CreateAcademicDegreeDto } from '../dto/create-academic-degree.dto';
import { UpdateAcademicDegreeDto } from '../dto/update-academic-degree.dto';
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/shared/auth/types/types';

@Controller('academic-degrees')
export class AcademicDegreesController {
  constructor(
    private readonly academicDegreesService: AcademicDegreesService
  ) {}
  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Post()
  async createAcademicDegree(
    @Body() input: CreateAcademicDegreeDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const academicDegree =
        await this.academicDegreesService.createAcademicDegree(
          input,
          currentUser
        );
      return academicDegree;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(':id')
  async getAcademicDegreeById(@Param('id') id: number) {
    try {
      const academicDegree =
        await this.academicDegreesService.findAcademicDegreeById(id);
      if (!academicDegree) {
        throw new NotFoundException(`Marital status with id ${id} not found.`);
      }
      return academicDegree;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get()
  async findAllAcademicDegreees() {
    return await this.academicDegreesService.findAllAcademicDegreees();
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Put()
  async updateAcademicDegreeById(
    id: number,
    @Body() input: UpdateAcademicDegreeDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const updatedAcademicDegree =
        await this.academicDegreesService.updateAcademicDegreeById(
          input,
          currentUser
        );
      return updatedAcademicDegree;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Delete(':id')
  async deleteAcademicDegreeById(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const message =
        await this.academicDegreesService.deleteAcademicDegreeById(
          id,
          currentUser
        );
      return { message };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
