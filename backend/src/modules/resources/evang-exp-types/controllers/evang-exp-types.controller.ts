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
import {EvangExpTypesService} from '../services/evang-exp-types.service'
import {CreateEvangExpTypeDto} from '../dto/create-evang-exp-type.dto'
import {UpdateEvangExpTypeDto} from '../dto/update-evang-exp-type.dto'
import {ERoles} from 'src/shared/auth/types/roles.enum'
import {Roles} from 'src/shared/roles/fz_decorators/roles.decorator'

@Controller('evang-exp-types')
export class EvangExpTypesController {
  constructor(private readonly evangExpTypesService: EvangExpTypesService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Post()
  async createEvangExpType(@Body() input: CreateEvangExpTypeDto) {
    try {
      const evangExpType = await this.evangExpTypesService.createEvangExpType(
        input,
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
        id,
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
  async updateEvangExpType(@Body() input: UpdateEvangExpTypeDto) {
    try {
      const updatedEvangExpType =
        await this.evangExpTypesService.updateEvangExpTypeById(input)
      return updatedEvangExpType
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Delete(':id')
  async deleteEvangExpType(@Param('id') id: number) {
    try {
      const message = await this.evangExpTypesService.deleteEvangExpTypeById(id)
      return {message}
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
