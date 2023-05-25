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
  NotFoundException,
} from '@nestjs/common'
import {JwtAuthGuard} from 'src/shared/auth/guards/jwt-auth.guard'
import {ERoles} from 'src/shared/auth/types/roles.enum'
import {UserFromJwt} from 'src/shared/auth/types/types'
import {Roles} from 'src/shared/roles/fz_decorators/roles.decorator'
import {CreateEvangelisticExperienceDto} from '../dto/create-evangelistic-experience.dto'
import {UpdateEvangelisticExperienceDto} from '../dto/update-evangelistic-experience.dto'
import {EvangelisticExperiencesService} from '../services/evangelistic-experiences.service'
import {IEvangelisticExperience} from '../types/types'
import {CurrentUser} from 'src/shared/auth/decorators/current-user.decorator'

@Controller('evangelistic-experiences')
export class EvangelisticExperiencesController {
  constructor(
    private readonly evangelisticExperiencesService: EvangelisticExperiencesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  async createEvangelisticExperience(
    @Body() dto: CreateEvangelisticExperienceDto,
    @CurrentUser() user: UserFromJwt,
  ): Promise<IEvangelisticExperience> {
    const id = user.user_id

    try {
      const newEvangelisticExperience =
        await this.evangelisticExperiencesService.createEclExperience(dto, id)
      return newEvangelisticExperience
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get('person/')
  async findEvangelisticExperiencesByPersonId(
    @CurrentUser() user: UserFromJwt,
  ): Promise<IEvangelisticExperience[] | null> {
    try {
      const id = user.user_id
      console.log(id)
      const evangelisticExperiences =
        await this.evangelisticExperiencesService.findEvangelisticExperiencesByPersonId(
          id,
        )
      if (!evangelisticExperiences) {
        throw new NotFoundException(
          `No evangelistic experiences found for person with id ${id}.`,
        )
      }
      return evangelisticExperiences
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get(':id')
  async findEvangelisticExperienceById(
    @Param('id') id: number,
  ): Promise<IEvangelisticExperience | null> {
    try {
      const evangelisticExperience =
        await this.evangelisticExperiencesService.findEvangelisticExperienceById(
          id,
        )
      if (!evangelisticExperience) {
        throw new NotFoundException(
          `No evangelistic experience found with id ${id}.`,
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
  @Roles(ERoles.ADMINISTRACAO)
  async updateEvangelisticExperienceById(
    @Body() dto: UpdateEvangelisticExperienceDto,
    @CurrentUser() user: UserFromJwt,
  ): Promise<IEvangelisticExperience> {
    try {
      const user_id = user.user_id
      const updatedEvangelisticExperience =
        await this.evangelisticExperiencesService.updateEvangelisticExperienceById(
          dto,
          user_id,
        )
      return updatedEvangelisticExperience
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(ERoles.ADMINISTRACAO)
  async deleteEvangelisticExperienceById(
    @Param('id') id: number,
  ): Promise<string> {
    try {
      await this.evangelisticExperiencesService.deleteEvangelisticExperienceById(
        id,
      )
      return 'Evangelistic experience deleted successfully.'
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}