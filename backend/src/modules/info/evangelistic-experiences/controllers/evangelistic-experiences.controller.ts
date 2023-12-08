import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { CreateEvangelisticExperienceDto } from '../dto/create-evangelistic-experience.dto'
import { UpdateEvangelisticExperienceDto } from '../dto/update-evangelistic-experience.dto'
import { EvangelisticExperiencesService } from '../services/evangelistic-experiences.service'
import { IEvangelisticExperience } from '../types/types'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'

@Controller('evangelistic-experiences')
export class EvangelisticExperiencesController {
  constructor(
    private readonly evangelisticExperiencesService: EvangelisticExperiencesService
  ) {}

  @Post(':personType')
  @UseGuards(JwtAuthGuard)
  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  async createEvangelisticExperience(
    @Body() dto: CreateEvangelisticExperienceDto,
    @CurrentUser() currentUser: UserFromJwt,
    @Param('personType') personType: string
  ) {
    try {
      const user_id = currentUser.user_id
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.')
      }
      const newEvangelisticExperience =
        await this.evangelisticExperiencesService.createEclExperience(
          dto,
          user_id,
          personType,
          currentUser
        )
      return newEvangelisticExperience
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('person/:personType')
  async findEvangelisticExperiencesByPersonId(
    @CurrentUser() user: UserFromJwt,
    @Param('personType') personType: string
  ): Promise<IEvangelisticExperience[] | null> {
    try {
      const user_id = user.user_id
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.')
      }
      const evangelisticExperiences =
        await this.evangelisticExperiencesService.findEvangelisticExperiencesByPersonId(
          user_id,
          personType
        )
      if (!evangelisticExperiences) {
        throw new NotFoundException(
          `No evangelistic experiences found for person with user_id ${user_id}.`
        )
      }
      return evangelisticExperiences
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DIRECAO)
  @Get('approve/:personType/:userId')
  async findEvangelisticExperiencesByPersonIdToApprove(
    @CurrentUser() user: UserFromJwt,
    @Param('personType') personType: string,
    @Param('userId') userId: string
  ): Promise<IEvangelisticExperience[] | null> {
    try {
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.')
      }
      const evangelisticExperiences =
        await this.evangelisticExperiencesService.findEvangelisticExperiencesByPersonId(
          +userId,
          personType
        )
      if (!evangelisticExperiences) {
        throw new NotFoundException(
          `No evangelistic experiences found for person with user_id ${userId}.`
        )
      }
      return evangelisticExperiences
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get(':id')
  async findEvangelisticExperienceById(
    @Param('id') id: number
  ): Promise<IEvangelisticExperience | null> {
    try {
      const evangelisticExperience =
        await this.evangelisticExperiencesService.findEvangelisticExperienceById(
          id
        )
      if (!evangelisticExperience) {
        throw new NotFoundException(
          `No evangelistic experience found with id ${id}.`
        )
      }
      return evangelisticExperience
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get()
  async findAllEvangelisticExperiences(): Promise<IEvangelisticExperience[]> {
    try {
      const allEvangelisticExperiences =
        await this.evangelisticExperiencesService.findAllEvangelisticExperiences()
      return allEvangelisticExperiences
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE, ERoles.DIRECAO)
  async updateEvangelisticExperienceById(
    @Body() dto: UpdateEvangelisticExperienceDto,
    @CurrentUser() currentUser: UserFromJwt
  ): Promise<IEvangelisticExperience> {
    try {
      const updatedEvangelisticExperience =
        await this.evangelisticExperiencesService.updateEvangelisticExperienceById(
          dto,
          currentUser
        )
      return updatedEvangelisticExperience
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  async deleteEvangelisticExperienceById(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const message = {
        text: await this.evangelisticExperiencesService.deleteEvangelisticExperienceById(
          id,
          currentUser
        )
      }

      return message
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
