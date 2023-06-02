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
import { PublicationTypesService } from '../services/publication-types.service'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { CreatePublicationTypeDto } from '../dto/create-publication-type.dto'
import { UpdatePublicationType } from '../dto/update-publication-type.dto'

@Controller('publication-types')
export class PublicationTypesController {
  constructor(
    private readonly publicationTypesService: PublicationTypesService,
  ) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA)
  @Post()
  async createPublicationType(@Body() input: CreatePublicationTypeDto) {
    try {
      const publicationType =
        await this.publicationTypesService.createPublicationType(input)
      return publicationType
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DOCENTE)
  @Get(':id')
  async getPublicationTypeById(@Param('id') id: number) {
    try {
      const publicationType =
        await this.publicationTypesService.findPublicationTypeById(id)
      if (!publicationType) {
        throw new NotFoundException(`PublicationType with id ${id} not found.`)
      }
      return publicationType
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.ESTUDANTE)
  @Get()
  async findAllPublicationTypes() {
    try {
      const publicationTypes =
        await this.publicationTypesService.findAllPublicationTypes()
      return publicationTypes
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA)
  @Put()
  async updatePublicationType(@Body() input: UpdatePublicationType) {
    try {
      const updatedPublicationType =
        await this.publicationTypesService.updatePublicationTypeById(input)
      return updatedPublicationType
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA)
  @Delete(':id')
  async deletePublicationTypeById(@Param('id') id: number) {
    try {
      const message =
        await this.publicationTypesService.deletePublicationTypeById(id)
      return { message }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
