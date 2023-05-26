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
} from '@nestjs/common'
import {LanguageTypesService} from '../services/language-types.service'
import {CreateLanguageTypeDto} from '../dto/create-language-type.dto'
import {UpdateLanguageTypeDto} from '../dto/update-language-type.dto'
import {ERoles} from 'src/shared/auth/types/roles.enum'
import {Roles} from 'src/shared/roles/fz_decorators/roles.decorator'

@Controller('language-types')
export class LanguageTypesController {
  constructor(private readonly languageTypesService: LanguageTypesService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA)
  @Post()
  async createLanguageType(@Body() input: CreateLanguageTypeDto) {
    try {
      const languageType = await this.languageTypesService.createLanguageType(
        input,
      )
      return languageType
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get(':id')
  async getLanguageTypeById(@Param('id') id: number) {
    try {
      const languageType = await this.languageTypesService.findLanguageTypeById(
        id,
      )
      if (!languageType) {
        throw new NotFoundException(`Language type with id ${id} not found.`)
      }
      return languageType
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get()
  async findAllLanguageTypes() {
    return await this.languageTypesService.findAllLanguageTypes()
  }

  @Put()
  async updateLanguageType(@Body() input: UpdateLanguageTypeDto) {
    try {
      const updatedLanguageType =
        await this.languageTypesService.updateLanguageTypeById(input)
      return updatedLanguageType
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Delete(':id')
  async deleteLanguageType(@Param('id') id: number) {
    try {
      const message = await this.languageTypesService.deleteLanguageTypeById(id)
      return {message}
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
