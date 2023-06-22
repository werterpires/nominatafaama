import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { IEndowment } from '../types/types'
import { CreateEndowmentDto } from '../dto/create-endowment.dto'
import { EndowmentsService } from '../services/endowments.service'
import { UpdateEndowmentDto } from '../dto/update-endowment.dto'

@Controller('endowments')
export class EndowmentsController {
  constructor(private endowmentsService: EndowmentsService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Post(':personType')
  async createEndowment(
    @Body() input: CreateEndowmentDto,
    @CurrentUser() user: UserFromJwt,
    @Param('personType') personType: string,
  ) {
    try {
      const user_id = user.user_id
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.')
      }
      const endowment = await this.endowmentsService.createEndowment(
        input,
        user_id,
        personType,
      )
      return endowment
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('person/:personType')
  async findEndowmentsByPersonId(
    @CurrentUser() user: UserFromJwt,
    @Param('personType') personType: string,
  ): Promise<IEndowment[]> {
    try {
      const user_id = user.user_id
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.')
      }
      const endowments = await this.endowmentsService.findEndowmentsByPersonId(
        user_id,
        personType,
      )

      if (!endowments) {
        throw new NotFoundException(
          `No endowments found for person with id fornecido.`,
        )
      }
      return endowments
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get(':id')
  async findEndowmentById(@Param('id') id: number): Promise<IEndowment> {
    try {
      const endowment = await this.endowmentsService.findEndowmentById(id)
      if (!endowment) {
        throw new NotFoundException(`No endowment found with id ${id}.`)
      }
      return endowment
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE, ERoles.SECRETARIA)
  @Get()
  async findAllEndowments(): Promise<IEndowment[]> {
    try {
      const endowments = await this.endowmentsService.findAllEndowments()
      return endowments
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Put()
  async updateEndowmentById(
    @Body() input: UpdateEndowmentDto,
  ): Promise<IEndowment> {
    try {
      const updatedEndowment = await this.endowmentsService.updateEndowmentById(
        input,
      )
      return updatedEndowment
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Delete(':id')
  async deleteEndowmentById(@Param('id') id: number) {
    try {
      const message = await this.endowmentsService.deleteEndowmentById(id)
      return { message }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
