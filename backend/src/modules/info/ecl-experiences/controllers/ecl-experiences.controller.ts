import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, NotFoundException, Put, UseGuards } from '@nestjs/common';
import { EclExperiencesService } from '../services/ecl-experiences.service';
import { CreateEclExperienceDto } from '../dto/create-ecl-experience.dto';
import { UpdateEclExperienceDto, UpdateExperiencesDto } from '../dto/update-ecl-experience.dto';
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { UserFromJwt } from 'src/shared/auth/types/types';
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator';
import { IEclExperience } from '../types/types';

@Controller('ecl-experiences')
export class EclExperiencesController {
  constructor(private readonly eclExperiencesService: EclExperiencesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  async createEclExperience(
    @Body() dto: CreateEclExperienceDto,
    @CurrentUser() user: UserFromJwt): Promise<IEclExperience> {
    const id = user.user_id;

    try {
      const newEclExperience = await this.eclExperiencesService.createEclExperience(dto, id);
      return newEclExperience;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('person/')
  async findEclesiasticExperienceByPersonId(@CurrentUser() user: UserFromJwt): Promise<IEclExperience[] | null> {
    try {
      const id = user.user_id
      console.log(id)
      const eclExperiences = await this.eclExperiencesService.findEclesiasticExperienceByPersonId(id);
      if (!eclExperiences) {
        throw new NotFoundException(`No ecl experiences found for person with id ${id}.`);
      }
      return eclExperiences;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(':id')
  async findEclExperienceById(@Param('id') id: number): Promise<IEclExperience | null> {
    try {
      const eclExperience = await this.eclExperiencesService.findEclExperienceById(id);
      if (!eclExperience) {
        throw new NotFoundException(`No ecl experience found with id ${id}.`);
      }
      return eclExperience;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get()
  async findAllEclExperiences(): Promise<IEclExperience[]> {
    try {
      const allEclExperiences = await this.eclExperiencesService.findAllEclExperiences();
      return allEclExperiences;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @Roles(ERoles.ADMINISTRACAO)
  async updateEclExperienceById(@Body() dto: UpdateEclExperienceDto,
  ): Promise<IEclExperience> {
    try {
      const updatedEclExperience = await this.eclExperiencesService.updateEclExperienceById(dto);
      return updatedEclExperience;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Put('update-experiences')
  @UseGuards(JwtAuthGuard)
  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  async updateEclExperiences(@CurrentUser() user: UserFromJwt, @Body() dto: UpdateExperiencesDto,
  ): Promise<void> {
    try {
      const id = user.user_id
      await this.eclExperiencesService.updateEclExperiences(dto, id);
      
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(ERoles.ADMINISTRACAO)
  async deleteEclExperienceById(@Param('id') id: number): Promise<string> {
    try {
      await this.eclExperiencesService.deleteEclExperienceById(id);
      return 'Ecl experience deleted successfully.';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }  
  
}
