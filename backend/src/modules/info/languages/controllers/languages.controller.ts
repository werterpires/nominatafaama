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
import { LanguagesService } from '../services/languages.service'
import { NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { CreateLanguageDto } from '../dto/create-language.dto'
import { UpdateLanguageDto } from '../dto/update-language.dto'
import { ILanguage } from '../types/types'

@Controller('languages')
export class LanguagesController {
  constructor(private languagesService: LanguagesService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Post(':personType')
  async createLanguage(
    @Body() input: CreateLanguageDto,
    @CurrentUser() currentUser: UserFromJwt,
    @Param('personType') personType: string
  ) {
    try {
      const user_id = currentUser.user_id
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.')
      }
      const language = await this.languagesService.createLanguage(
        input,
        user_id,
        personType,
        currentUser
      )
      return language
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('person/:personType')
  async findLanguagesByPersonId(
    @CurrentUser() user: UserFromJwt,
    @Param('personType') personType: string
  ): Promise<ILanguage[]> {
    try {
      const user_id = user.user_id
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.')
      }
      const languages = await this.languagesService.findLanguagesByPersonId(
        user_id,
        personType
      )

      if (!languages) {
        throw new NotFoundException(
          `No languages found for person with id fornecido.`
        )
      }
      return languages
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DIRECAO, ERoles.MINISTERIAL)
  @Get('approve/:personType/:userId')
  async findLanguagesByPersonIdToApprove(
    @CurrentUser() user: UserFromJwt,
    @Param('personType') personType: string,
    @Param('userId') userId: string
  ): Promise<ILanguage[]> {
    try {
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.')
      }
      const languages = await this.languagesService.findLanguagesByPersonId(
        +userId,
        personType
      )

      if (!languages) {
        throw new NotFoundException(
          `No languages found for person with id fornecido.`
        )
      }
      return languages
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get(':id')
  async findLanguageById(@Param('id') id: number): Promise<ILanguage> {
    try {
      const language = await this.languagesService.findLanguageById(id)
      if (!language) {
        throw new NotFoundException(`No language found with id ${id}.`)
      }
      return language
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE, ERoles.SECRETARIA)
  @Get()
  async findAllLanguages(): Promise<ILanguage[]> {
    try {
      const languages = await this.languagesService.findAllLanguages()
      return languages
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
  async updateLanguageById(
    @Body() input: UpdateLanguageDto,
    @CurrentUser() currentUser: UserFromJwt
  ): Promise<ILanguage> {
    try {
      const updatedLanguage = await this.languagesService.updateLanguageById(
        input,
        currentUser
      )
      return updatedLanguage
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Delete(':id')
  async deleteLanguageById(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const message = await this.languagesService.deleteLanguageById(
        id,
        currentUser
      )
      return { message }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
