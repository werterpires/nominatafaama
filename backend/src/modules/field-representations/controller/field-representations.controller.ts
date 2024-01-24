import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  Put
} from '@nestjs/common'
import { FieldRepresentationsService } from '../services/field-representations.service'
import { CreateFieldRepresentationDto } from '../dto/create-field-representation.dto'
import {
  EvaluateFieldRepresentationDto,
  UpdateFieldRepresentationDto
} from '../dto/update-field-representation.dto'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Controller('field-representations')
export class FieldRepresentationsController {
  constructor(
    private readonly fieldRepresentationsService: FieldRepresentationsService
  ) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Post()
  async createFieldRepresentation(
    @Body() input: CreateFieldRepresentationDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const fieldRep =
        await this.fieldRepresentationsService.createFieldRepresentation(
          input,
          currentUser
        )
      return fieldRep
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DIRECAO, ERoles.MINISTERIAL)
  @Get('notRated')
  async getNotRatedFieldRepresentations(
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const fieldRepresentations =
        await this.fieldRepresentationsService.findNotRatedFieldRepresentations()
      return fieldRepresentations
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Get('user')
  async getFieldRepresentationsByUserID(
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const fieldRepresentation =
        await this.fieldRepresentationsService.findFieldRepresentationsByUserIdToEdit(
          currentUser
        )
      return fieldRepresentation
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DIRECAO, ERoles.MINISTERIAL)
  @Get('rep/:repID')
  async getFieldRepresentationsByRepID(
    @CurrentUser() currentUser: UserFromJwt,
    @Param('repID') repID: string
  ) {
    try {
      const fieldRepresentation =
        await this.fieldRepresentationsService.findFieldRepresentationsByRepId(
          parseInt(repID)
        )
      return fieldRepresentation
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Get(':representationID')
  async getFieldRepresentationByID(
    @CurrentUser() currentUser: UserFromJwt,
    @Param('representationID') representationID: string
  ) {
    try {
      const fieldRepresentation =
        await this.fieldRepresentationsService.findFieldRepresentationsById(
          parseInt(representationID)
        )
      return fieldRepresentation
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Put('evaluate')
  async evaluateFieldRepresentation(
    @Body() input: EvaluateFieldRepresentationDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const updatedFieldRep =
        await this.fieldRepresentationsService.evaluateFieldRepresentationById(
          input,
          currentUser
        )
      return updatedFieldRep
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Put()
  async updateFieldRepresentation(
    @Body() input: UpdateFieldRepresentationDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const updatedFieldRep =
        await this.fieldRepresentationsService.updateFieldRepresentationById(
          input,
          currentUser
        )
      return updatedFieldRep
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Delete(':id')
  async deleteStudentById(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const message =
        await this.fieldRepresentationsService.deleteFieldRepresentationById(
          id,
          currentUser
        )
      return { message }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
