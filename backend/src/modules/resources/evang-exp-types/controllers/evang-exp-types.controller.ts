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
import { EvangExpTypesService } from '../services/evang-exp-types.service'
import { CreateEvangExpTypeDto } from '../dto/create-evang-exp-type.dto'
import { UpdateEvangExpTypeDto } from '../dto/update-evang-exp-type.dto'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'

@Controller('evang-exp-types')
export class EvangExpTypesController {
  constructor(private readonly evangExpTypesService: EvangExpTypesService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Post()
  async createEvangExpType(
    @Body() input: CreateEvangExpTypeDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const evangExpType = await this.evangExpTypesService.createEvangExpType(
        input,
        currentUser
      )
      return evangExpType
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get(':id')
  async getEvangExpTypeById(@Param('id') id: number) {
    try {
      const evangExpType = await this.evangExpTypesService.findEvangExpTypeById(
        id
      )
      if (!evangExpType) {
        throw new NotFoundException(`EvangExp type with id ${id} not found.`)
      }
      return evangExpType
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get()
  async findAllEvangExpTypes() {
    return await this.evangExpTypesService.findAllEvangExpTypes()
  }

  @Put()
  async updateEvangExpType(
    @Body() input: UpdateEvangExpTypeDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const updatedEvangExpType =
        await this.evangExpTypesService.updateEvangExpTypeById(
          input,
          currentUser
        )
      return updatedEvangExpType
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Delete(':id')
  async deleteEvangExpType(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const message = await this.evangExpTypesService.deleteEvangExpTypeById(
        id,
        currentUser
      )
      return { message }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
