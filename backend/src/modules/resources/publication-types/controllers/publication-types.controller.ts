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
  Put
} from '@nestjs/common'
import { PublicationTypesService } from '../services/publication-types.service'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { CreatePublicationTypeDto } from '../dto/create-publication-type.dto'
import { UpdatePublicationType } from '../dto/update-publication-type.dto'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'

@Controller('publication-types')
export class PublicationTypesController {
  constructor(
    private readonly publicationTypesService: PublicationTypesService
  ) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Post()
  async createPublicationType(
    @Body() input: CreatePublicationTypeDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const publicationType =
        await this.publicationTypesService.createPublicationType(
          input,
          currentUser
        )
      return publicationType
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
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

  @Roles(
    ERoles.ADMINISTRACAO,
    ERoles.SECRETARIA,
    ERoles.ESTUDANTE,
    ERoles.DIRECAO
  )
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

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Put()
  async updatePublicationType(
    @Body() input: UpdatePublicationType,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const updatedPublicationType =
        await this.publicationTypesService.updatePublicationTypeById(
          input,
          currentUser
        )
      return updatedPublicationType
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Delete(':id')
  async deletePublicationTypeById(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const message =
        await this.publicationTypesService.deletePublicationTypeById(
          id,
          currentUser
        )
      return { message }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
