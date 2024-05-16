import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common'
import { NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { CreatePreviousMarriageDto } from '../dto/create-previous-marriage.dto'
import { UpdatePreviousMarriageDto } from '../dto/update-previous-marriage.dto'
import { IPreviousMarriage } from '../types/types'
import { PreviousMarriagesService } from '../services/previous-marriage.service'

@Controller('previous-marriages')
export class PreviousMarriagesController {
  constructor(private previousMarriagesService: PreviousMarriagesService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Post()
  async createPreviousMarriage(
    @Body() input: CreatePreviousMarriageDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const { user_id } = currentUser
      const previousMarriage =
        await this.previousMarriagesService.createPreviousMarriage(
          input,
          user_id,
          currentUser
        )
      return previousMarriage
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('student')
  async findPreviousMarriagesByStudentId(
    @CurrentUser() user: UserFromJwt
  ): Promise<IPreviousMarriage[]> {
    try {
      const { user_id } = user
      const previousMarriages =
        await this.previousMarriagesService.findPreviousMarriagesByStudentId(
          user_id
        )

      if (!previousMarriages) {
        throw new NotFoundException(`No previous marriages found for student.`)
      }

      return previousMarriages
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DIRECAO, ERoles.MINISTERIAL)
  @Get('approve/:userId')
  async findPreviousMarriagesByStudentIdToApprove(
    @Param('userId') userId: string
  ): Promise<IPreviousMarriage[]> {
    try {
      const previousMarriages =
        await this.previousMarriagesService.findPreviousMarriagesByStudentId(
          +userId
        )

      if (!previousMarriages) {
        throw new NotFoundException(`No previous marriages found for student.`)
      }

      return previousMarriages
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get(':id')
  async findPreviousMarriageById(
    @Param('id') id: number
  ): Promise<IPreviousMarriage> {
    try {
      const previousMarriage =
        await this.previousMarriagesService.findPreviousMarriageById(id)

      if (!previousMarriage) {
        throw new NotFoundException(`No previous marriage found with id ${id}.`)
      }

      return previousMarriage
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA)
  @Get()
  async findAllPreviousMarriages(): Promise<IPreviousMarriage[]> {
    try {
      const previousMarriages =
        await this.previousMarriagesService.findAllPreviousMarriages()
      return previousMarriages
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
  async updatePreviousMarriageById(
    @Body() input: UpdatePreviousMarriageDto,
    @CurrentUser() currentUser: UserFromJwt
  ): Promise<IPreviousMarriage> {
    try {
      const updatedPreviousMarriage =
        await this.previousMarriagesService.updatePreviousMarriageById(
          input,
          currentUser
        )
      return updatedPreviousMarriage
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO)
  @Delete(':id')
  async deletePreviousMarriageById(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const message =
        await this.previousMarriagesService.deletePreviousMarriageById(
          id,
          currentUser
        )
      return { message }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
