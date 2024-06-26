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
  UseGuards
} from '@nestjs/common'
import { EclExperiencesService } from '../services/ecl-experiences.service'
import { CreateEclExperienceDto } from '../dto/create-ecl-experience.dto'
import { UpdateExperiencesDto } from '../dto/update-ecl-experience.dto'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { IEclExperience } from '../types/types'

@Controller('ecl-experiences')
export class EclExperiencesController {
  constructor(private readonly eclExperiencesService: EclExperiencesService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('person/')
  async findEclesiasticExperienceByPersonId(
    @CurrentUser() user: UserFromJwt
  ): Promise<IEclExperience[] | null> {
    try {
      const id = user.user_id
      const eclExperiences =
        await this.eclExperiencesService.findEclesiasticExperienceByPersonId(id)
      if (!eclExperiences) {
        throw new NotFoundException(
          `No ecl experiences found for person with id ${id}.`
        )
      }
      return eclExperiences
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DIRECAO, ERoles.MINISTERIAL)
  @Get('approve/student/:userId')
  async findEclesiasticExperienceByPersonIdToApprove(
    @CurrentUser() user: UserFromJwt,
    @Param('userId') userId: string
  ): Promise<IEclExperience[] | null> {
    try {
      const eclExperiences =
        await this.eclExperiencesService.findEclesiasticExperienceByPersonId(
          +userId
        )
      if (!eclExperiences) {
        throw new NotFoundException(
          `No ecl experiences found for person with id ${userId}.`
        )
      }
      return eclExperiences
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get(':id')
  async findEclExperienceById(
    @Param('id') id: number
  ): Promise<IEclExperience | null> {
    try {
      const eclExperience =
        await this.eclExperiencesService.findEclExperienceById(id)
      if (!eclExperience) {
        throw new NotFoundException(`No ecl experience found with id ${id}.`)
      }
      return eclExperience
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get()
  async findAllEclExperiences(): Promise<IEclExperience[]> {
    try {
      const allEclExperiences =
        await this.eclExperiencesService.findAllEclExperiences()
      return allEclExperiences
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(
    ERoles.ADMINISTRACAO,
    ERoles.ESTUDANTE,
    ERoles.DIRECAO,
    ERoles.MINISTERIAL
  )
  @Put()
  async updateEclExperienceById(
    @Body() dto: UpdateExperiencesDto,
    @CurrentUser() currentUser: UserFromJwt
  ): Promise<IEclExperience[]> {
    try {
      const id = currentUser.user_id
      const updatedEclExperience =
        await this.eclExperiencesService.updateEclExperienceByPersonId(
          dto,
          id,
          currentUser
        )
      return updatedEclExperience
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
