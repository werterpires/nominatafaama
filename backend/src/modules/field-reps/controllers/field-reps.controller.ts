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
import { FieldRepsService } from '../services/field-reps.service'
import { CreateFieldRepDto } from '../dto/create-field-rep.dto'
import { UpdateFieldRepDto } from '../dto/update-field-rep.dto'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { FavoritesService } from '../services/favorites.service'
import { SetFavDto } from '../dto/set-fav.dto'

@Controller('field-reps')
export class FieldRepsController {
  constructor(
    private readonly fieldRepsService: FieldRepsService,
    private readonly favoritesService: FavoritesService
  ) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Post()
  async createFieldRep(
    @Body() input: CreateFieldRepDto,
    @CurrentUser() user: UserFromJwt
  ) {
    try {
      const userId = user.user_id
      const fieldRep = await this.fieldRepsService.createFieldRep(input, user)
      return fieldRep
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Post('favorites')
  async setFavorite(
    @Body() input: SetFavDto,
    @CurrentUser() user: UserFromJwt
  ) {
    try {
      const favorites = await this.favoritesService.setFavorite(input, user)
      return favorites
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Get('edit')
  async getFieldRepByIdToEdit(@CurrentUser() user: UserFromJwt) {
    const id = user.user_id

    try {
      const fieldRep = await this.fieldRepsService.findFieldRepByIdToEdit(id)
      return fieldRep
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Get('favorites')
  async getRepFavorites(@CurrentUser() user: UserFromJwt) {
    try {
      const favorites = await this.favoritesService.findRepFavorites(user)
      return favorites
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DIRECAO)
  @Get('all')
  async getAllFieldReps() {
    try {
      const fieldRep = await this.fieldRepsService.findAllFieldRep()
      return fieldRep
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Put()
  async updateFieldRep(
    @Body() input: UpdateFieldRepDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const updatedFieldRep = await this.fieldRepsService.updateFieldRepById(
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
      const message = await this.fieldRepsService.deleteFieldRepById(
        id,
        currentUser
      )
      return { message }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Delete('favorites/:studentId')
  async setNotFavorite(
    @Param('studentId') studentId: string,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const favorites = await this.favoritesService.setNotFavorite(
        parseInt(studentId),
        currentUser
      )
      return favorites
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
