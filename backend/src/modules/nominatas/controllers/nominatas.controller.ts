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
import { NominatasService } from '../services/nominatas.service'
import { CreateNominataDto } from '../dto/create-nominata.dto'
import { UpdateNominataDto } from '../dto/update-nominata.dto'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'

@Controller('nominatas')
export class NominatasController {
  constructor(private readonly nominatasService: NominatasService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Post()
  async createNominata(@Body() input: CreateNominataDto) {
    try {
      const nominata = await this.nominatasService.createNominata(input)
      return nominata
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get(':id')
  async getNominataById(@Param('id') id: number) {
    try {
      const nominata = await this.nominatasService.findNominataById(id)
      if (!nominata) {
        throw new NotFoundException(`Marital status with id ${id} not found.`)
      }
      return nominata
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Get()
  async findAllNominataes() {
    try {
      return await this.nominatasService.findAllNominatas()
    } catch (error) {
      throw error
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Put()
  async updateNominataById(@Body() input: UpdateNominataDto) {
    try {
      const updatedNominata = await this.nominatasService.updateNominataById(
        input,
      )
      return updatedNominata
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Delete(':id')
  async deleteNominataById(@Param('id') id: number) {
    try {
      const message = await this.nominatasService.deleteNominataById(id)
      return { message }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
