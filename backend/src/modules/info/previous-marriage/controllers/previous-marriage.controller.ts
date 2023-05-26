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
import {NotFoundException, InternalServerErrorException} from '@nestjs/common'
import {CurrentUser} from 'src/shared/auth/decorators/current-user.decorator'
import {ERoles} from 'src/shared/auth/types/roles.enum'
import {UserFromJwt} from 'src/shared/auth/types/types'
import {Roles} from 'src/shared/roles/fz_decorators/roles.decorator'
import {CreatePreviousMarriageDto} from '../dto/create-previous-marriage.dto'
import {UpdatePreviousMarriageDto} from '../dto/update-previous-marriage.dto'
import {IPreviousMarriage} from '../types/types'
import {PreviousMarriagesService} from '../services/previous-marriage.service'

@Controller('previous-marriages')
export class PreviousMarriagesController {
  constructor(private previousMarriagesService: PreviousMarriagesService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Post()
  async createPreviousMarriage(
    @Body() input: CreatePreviousMarriageDto,
    @CurrentUser() user: UserFromJwt,
  ) {
    try {
      const {user_id} = user
      const previousMarriage =
        await this.previousMarriagesService.createPreviousMarriage(
          input,
          user_id,
        )
      return previousMarriage
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE, ERoles.DIRECAO, ERoles.DOCENTE)
  @Get('student')
  async findPreviousMarriagesByStudentId(
    @CurrentUser() user: UserFromJwt,
  ): Promise<IPreviousMarriage[]> {
    try {
      const {user_id} = user
      const previousMarriages =
        await this.previousMarriagesService.findPreviousMarriagesByStudentId(
          user_id,
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
    @Param('id') id: number,
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

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE, ERoles.SECRETARIA)
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

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Put()
  async updatePreviousMarriageById(
    @Body() input: UpdatePreviousMarriageDto,
  ): Promise<IPreviousMarriage> {
    try {
      const updatedPreviousMarriage =
        await this.previousMarriagesService.updatePreviousMarriageById(input)
      return updatedPreviousMarriage
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO)
  @Delete(':id')
  async deletePreviousMarriageById(@Param('id') id: number) {
    try {
      const message =
        await this.previousMarriagesService.deletePreviousMarriageById(id)
      return {message}
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}