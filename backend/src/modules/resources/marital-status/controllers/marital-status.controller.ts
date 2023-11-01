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
import { MaritalStatusService } from '../services/marital-status.service'
import { CreateMaritalStatusDto } from '../dto/create-marital-status.dto'
import { UpdateMaritalStatusDto } from '../dto/update-marital-status.dto'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'

@Controller('marital-status')
export class MaritalStatusController {
  constructor(private readonly maritalStatusService: MaritalStatusService) {}
  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Post()
  async createMaritalStatus(
    @Body() input: CreateMaritalStatusDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const maritalStatus = await this.maritalStatusService.createMaritalStatus(
        input,
        currentUser
      )
      return maritalStatus
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get(':id')
  async getMaritalStatusById(@Param('id') id: number) {
    try {
      const maritalStatus =
        await this.maritalStatusService.findMaritalStatusById(id)
      if (!maritalStatus) {
        throw new NotFoundException(`Marital status with id ${id} not found.`)
      }
      return maritalStatus
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get()
  async findAllMaritalStatuses() {
    return await this.maritalStatusService.findAllMaritalStatuses()
  }

  @Put()
  async updateMaritalStatusById(
    id: number,
    @Body() input: UpdateMaritalStatusDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const updatedMaritalStatus =
        await this.maritalStatusService.updateMaritalStatusById(
          input,
          currentUser
        )
      return updatedMaritalStatus
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Delete(':id')
  async deleteMaritalStatusById(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const message = await this.maritalStatusService.deleteMaritalStatusById(
        id,
        currentUser
      )
      return { message }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
