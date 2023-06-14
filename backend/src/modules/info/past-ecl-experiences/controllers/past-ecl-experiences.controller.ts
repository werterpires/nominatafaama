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
import {IPastEclExp} from '../types/types'
import {CreatePastEclExpDto} from '../dto/create-past-ecl-experience.dto'
import {PastEclExpsService} from '../services/past-ecl-experiences.service'
import {UpdatePastEclExpDto} from '../dto/update-past-ecl-experience.dto'

@Controller('past-ecl-exps')
export class PastEclExpsController {
  constructor(private pastEclExpsService: PastEclExpsService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Post(':personType')
  async createPastEclExp(
    @Body() input: CreatePastEclExpDto,
    @CurrentUser() user: UserFromJwt,
    @Param('personType') personType: string,
  ) {
    try {
      const user_id = user.user_id
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.')
      }
      const pastEclExp = await this.pastEclExpsService.createPastEclExp(
        input,
        user_id,
        personType,
      )
      return pastEclExp
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('person/:personType')
  async findPastEclExpsByPersonId(
    @CurrentUser() user: UserFromJwt,
    @Param('personType') personType: string,
  ): Promise<IPastEclExp[]> {
    try {
      const user_id = user.user_id
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.')
      }
      const pastEclExps =
        await this.pastEclExpsService.findPastEclExpsByPersonId(
          user_id,
          personType,
        )

      if (!pastEclExps) {
        throw new NotFoundException(
          `No past ecclesiastical experiences found for person with id fornecido.`,
        )
      }
      return pastEclExps
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get(':id')
  async findPastEclExpById(@Param('id') id: number): Promise<IPastEclExp|null> {
    try {
      const pastEclExp = await this.pastEclExpsService.findPastEclExpById(id)
      return pastEclExp
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE, ERoles.SECRETARIA)
  @Get()
  async findAllPastEclExps(): Promise<IPastEclExp[]> {
    try {
      const pastEclExps = await this.pastEclExpsService.findAllPastEclExps()
      return pastEclExps
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Put()
  async updatePastEclExpById(
    @Body() input: UpdatePastEclExpDto,
  ): Promise<IPastEclExp> {
    try {
      const updatedPastEclExp =
        await this.pastEclExpsService.updatePastEclExpById(input)
      return updatedPastEclExp
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Delete(':id')
  async deletePastEclExpById(@Param('id') id: number) {
    try {
      const message = await this.pastEclExpsService.deletePastEclExpById(id)
      return {message}
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
