import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put
} from '@nestjs/common'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { CreateSpouseDto } from '../dto/create-spouse.dto'
import { UpdateSpouseDto } from '../dto/update-spouse.dto'
import { SpousesService } from '../services/spouses.service'
import { ISpouse } from '../types/types'

@Controller('spouses')
export class SpousesController {
  constructor(private spousesService: SpousesService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Post()
  async createSpouse(
    @Body() input: CreateSpouseDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    const id = currentUser.user_id
    try {
      const spouse = await this.spousesService.createSpouse(
        input,
        id,
        currentUser
      )
      return spouse
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('edit')
  async findSpouseById(@CurrentUser() user: UserFromJwt): Promise<ISpouse> {
    const id = user.user_id
    try {
      const spouse = await this.spousesService.findSpouseByUserId(id)
      return spouse
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DIRECAO, ERoles.MINISTERIAL)
  @Get('approve/:userId')
  async findSpouseByIdToApprove(
    @CurrentUser() user: UserFromJwt,
    @Param('userId') userId: string
  ): Promise<ISpouse> {
    try {
      const spouse = await this.spousesService.findSpouseByUserId(+userId)
      return spouse
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
  async updateSpouse(
    @Body() input: UpdateSpouseDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const id = currentUser.user_id
      const updatedSpouse = await this.spousesService.updateSpouseById(
        input,
        id,
        currentUser
      )
      return updatedSpouse
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
  @Put('approve/:userId')
  async updateSpouseToApprove(
    @Body() input: UpdateSpouseDto,
    @CurrentUser() currentUser: UserFromJwt,
    @Param('userId') userId: string
  ) {
    try {
      const updatedSpouse = await this.spousesService.updateSpouseById(
        input,
        +userId,
        currentUser
      )
      return updatedSpouse
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.ESTUDANTE)
  @Delete(':id')
  async deleteSpouseById(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const message = await this.spousesService.deleteSpouseById(
        id,
        currentUser
      )
      return { message }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
