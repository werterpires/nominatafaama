import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common'
import { NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { IRelatedMinistry } from '../types/types'
import { CreateRelatedMinistryDto } from '../dto/create-related-ministry.dto'
import { RelatedMinistriesService } from '../services/related-ministries.service'
import { UpdateRelatedMinistryDto } from '../dto/update-related-ministry.dto'

@Controller('related-ministries')
export class RelatedMinistriesController {
  constructor(private relatedMinistriesService: RelatedMinistriesService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Post(':personType')
  async createRelatedMinistry(
    @Body() input: CreateRelatedMinistryDto,
    @CurrentUser() currentUser: UserFromJwt,
    @Param('personType') personType: string
  ) {
    try {
      const user_id = currentUser.user_id
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.')
      }
      const relatedMinistry =
        await this.relatedMinistriesService.createRelatedMinistry(
          input,
          user_id,
          personType,
          currentUser
        )
      return relatedMinistry
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('person/:personType')
  async findRelatedMinistriesByPersonId(
    @CurrentUser() user: UserFromJwt,
    @Param('personType') personType: string
  ): Promise<IRelatedMinistry[]> {
    try {
      const user_id = user.user_id
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.')
      }
      const relatedMinistries =
        await this.relatedMinistriesService.findRelatedMinistriesByPersonId(
          user_id,
          personType
        )

      if (!relatedMinistries) {
        throw new NotFoundException(
          `No related ministries found for person with id fornecido.`
        )
      }
      return relatedMinistries
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DIRECAO, ERoles.MINISTERIAL)
  @Get('approve/:personType/:userId')
  async findRelatedMinistriesByPersonIdToApprove(
    @CurrentUser() user: UserFromJwt,
    @Param('personType') personType: string,
    @Param('userId') userId: string
  ): Promise<IRelatedMinistry[]> {
    try {
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.')
      }
      const relatedMinistries =
        await this.relatedMinistriesService.findRelatedMinistriesByPersonId(
          +userId,
          personType
        )

      if (!relatedMinistries) {
        throw new NotFoundException(
          `No related ministries found for person with id fornecido.`
        )
      }
      return relatedMinistries
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get(':id')
  async findRelatedMinistryById(
    @Param('id') id: number
  ): Promise<IRelatedMinistry> {
    try {
      const relatedMinistry =
        await this.relatedMinistriesService.findRelatedMinistryById(id)
      if (!relatedMinistry) {
        throw new NotFoundException(`No related ministry found with id ${id}.`)
      }
      return relatedMinistry
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE, ERoles.SECRETARIA)
  @Get()
  async findAllRelatedMinistries(): Promise<IRelatedMinistry[]> {
    try {
      const relatedMinistries =
        await this.relatedMinistriesService.findAllRelatedMinistries()
      return relatedMinistries
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
  async updateRelatedMinistryById(
    @Body() input: UpdateRelatedMinistryDto,
    @CurrentUser() currentUser: UserFromJwt
  ): Promise<IRelatedMinistry> {
    try {
      const updatedRelatedMinistry =
        await this.relatedMinistriesService.updateRelatedMinistryById(
          input,
          currentUser
        )
      return updatedRelatedMinistry
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Delete(':id')
  async deleteRelatedMinistryById(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const message =
        await this.relatedMinistriesService.deleteRelatedMinistryById(
          id,
          currentUser
        )
      return { message }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
