import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import {ProfessionalExperiencesService} from '../services/professional-experiences.service'
import {NotFoundException, InternalServerErrorException} from '@nestjs/common'
import {CurrentUser} from 'src/shared/auth/decorators/current-user.decorator'
import {ERoles} from 'src/shared/auth/types/roles.enum'
import {UserFromJwt} from 'src/shared/auth/types/types'
import {Roles} from 'src/shared/roles/fz_decorators/roles.decorator'
import {CreateProfessionalExperienceDto} from '../dto/create-professional-experience.dto'
import {UpdateProfessionalExperienceDto} from '../dto/update-professional-experience.dto'
import {IProfessionalExperience} from '../types/types'

@Controller('professional-experiences')
export class ProfessionalExperiencesController {
  constructor(private experiencesService: ProfessionalExperiencesService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Post(':personType')
  async createProfessionalExperience(
    @Body() input: CreateProfessionalExperienceDto,
    @CurrentUser() user: UserFromJwt,
    @Param('personType') personType: string,
  ) {
    try {
      const user_id = user.user_id
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.')
      }
      const experience =
        await this.experiencesService.createProfessionalExperience(
          input,
          user_id,
          personType,
        )
      return experience
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('person/:personType')
  async findProfessionalExperiencesByPersonId(
    @CurrentUser() user: UserFromJwt,
    @Param('personType') personType: string,
  ): Promise<IProfessionalExperience[]> {
    try {
      const user_id = user.user_id
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.')
      }
      const experiences =
        await this.experiencesService.findProfessionalExperiencesByPersonId(
          user_id,
          personType,
        )

      if (!experiences) {
        throw new NotFoundException(
          `No professional experiences found for person with provided id.`,
        )
      }
      return experiences
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get(':id')
  async findProfessionalExperienceById(
    @Param('id') id: number,
  ): Promise<IProfessionalExperience> {
    try {
      const experience =
        await this.experiencesService.findProfessionalExperienceById(id)
      if (!experience) {
        throw new NotFoundException(
          `No professional experience found with id ${id}.`,
        )
      }
      return experience
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE, ERoles.SECRETARIA)
  @Get()
  async findAllProfessionalExperiences(): Promise<IProfessionalExperience[]> {
    try {
      const experiences =
        await this.experiencesService.findAllProfessionalExperiences()
      return experiences
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Put()
  async updateProfessionalExperienceById(
    @Body() input: UpdateProfessionalExperienceDto,
  ): Promise<IProfessionalExperience> {
    try {
      const updatedExperience =
        await this.experiencesService.updateProfessionalExperienceById(input)
      return updatedExperience
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Delete(':id')
  async deleteProfessionalExperienceById(@Param('id') id: number) {
    try {
      const message =
        await this.experiencesService.deleteProfessionalExperienceById(id)
      return {message}
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
