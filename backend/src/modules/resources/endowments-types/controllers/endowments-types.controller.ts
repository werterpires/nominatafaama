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
import { EndowmentTypesService } from '../services/endowments-types.service'
import { CreateEndowmentTypeDto } from '../dto/create-endowments-type.dto'
import { UpdateEndowmentTypeDto } from '../dto/update-endowments-type.dto'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'

@Controller('endowment-types')
export class EndowmentsTypesController {
  constructor(private readonly endowmentTypesService: EndowmentTypesService) {}

  @Post()
  async createEndowmentType(
    @Body() input: CreateEndowmentTypeDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const endowmentType =
        await this.endowmentTypesService.createEndowmentType(input, currentUser)
      return endowmentType
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get(':id')
  async getEndowmentTypeById(@Param('id') id: number) {
    try {
      const endowmentType =
        await this.endowmentTypesService.findEndowmentTypeById(id)
      if (!endowmentType) {
        throw new NotFoundException(`Endowment type with id ${id} not found.`)
      }
      return endowmentType
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get()
  async findAllEndowmentTypes() {
    return await this.endowmentTypesService.findAllEndowmentTypes()
  }

  @Get('/filter/:type')
  async findEndowmentTypesByType(@Param('type') type: string) {
    try {
      const endowmentTypes =
        await this.endowmentTypesService.findEndowmentTypesByApplicationType(
          type
        )
      return endowmentTypes
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Put()
  async updateEndowmentType(
    @Body() input: UpdateEndowmentTypeDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const updatedEndowmentType =
        await this.endowmentTypesService.updateEndowmentTypeById(
          input,
          currentUser
        )
      return updatedEndowmentType
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Delete(':id')
  async deleteEndowmentType(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const message = await this.endowmentTypesService.deleteEndowmentTypeById(
        id,
        currentUser
      )
      return { message }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
