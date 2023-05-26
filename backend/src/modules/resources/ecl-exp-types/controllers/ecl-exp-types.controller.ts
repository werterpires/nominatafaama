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
import {EclExpTypesService} from '../services/ecl-exp-types.service'
import {CreateEclExpTypeDto} from '../dto/create-ecl-exp-type.dto'
import {UpdateEclExpTypeDto} from '../dto/update-ecl-exp-type.dto'
import {ERoles} from 'src/shared/auth/types/roles.enum'
import {Roles} from 'src/shared/roles/fz_decorators/roles.decorator'

@Controller('ecl-exp-types')
export class EclExpTypesController {
  constructor(private readonly eclExpTypesService: EclExpTypesService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA)
  @Post()
  async createEclExpType(@Body() input: CreateEclExpTypeDto) {
    try {
      const eclExpType = await this.eclExpTypesService.createEclExpType(input)
      return eclExpType
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get(':id')
  async getEclExpTypeById(@Param('id') id: number) {
    try {
      const eclExpType = await this.eclExpTypesService.findEclExpTypeById(id)
      if (!eclExpType) {
        throw new NotFoundException(`EclExp type with id ${id} not found.`)
      }
      return eclExpType
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get()
  async findAllEclExpTypes() {
    return await this.eclExpTypesService.findAllEclExpTypes()
  }

  @Put()
  async updateEclExpType(@Body() input: UpdateEclExpTypeDto) {
    try {
      const updatedEclExpType =
        await this.eclExpTypesService.updateEclExpTypeById(input)
      return updatedEclExpType
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Delete(':id')
  async deleteEclExpType(@Param('id') id: number) {
    try {
      const message = await this.eclExpTypesService.deleteEclExpTypeById(id)
      return {message}
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
