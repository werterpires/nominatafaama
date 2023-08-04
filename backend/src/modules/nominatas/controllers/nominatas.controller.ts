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
import { IsPublic } from 'src/shared/auth/decorators/is-public.decorator'
import { ISinteticProfessor, ISinteticStudent } from '../types/types'
import { UpdateNominataStudentsDto } from '../dto/update-nominata-students.dto'
import { UpdateNominataProfessorsDto } from '../dto/update-nominata-professors.dto copy'

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

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Post('students/')
  async addStudentToNominata(@Body() input: UpdateNominataStudentsDto) {
    try {
      const result = await this.nominatasService.addStudentsToNominata(input)
      return result
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Post('professors/')
  async addProfessorToNominata(@Body() input: UpdateNominataProfessorsDto) {
    try {
      const result = await this.nominatasService.addProfessorsToNominata(input)
      return result
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Get('students/')
  async findAllStudents(): Promise<ISinteticStudent[]> {
    try {
      return await this.nominatasService.findAllNOminataStudents()
    } catch (error) {
      throw error
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Get('professors/')
  async findAllProfessors(): Promise<ISinteticProfessor[]> {
    try {
      return await this.nominatasService.findAllNOminataProfessors()
    } catch (error) {
      throw error
    }
  }

  @IsPublic()
  @Get(':year')
  async getNominataByIYear(@Param('year') year: string) {
    try {
      const nominata = await this.nominatasService.findNominataByYear(year)
      if (!nominata) {
        throw new NotFoundException(`Nominata with year ${year} not found.`)
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
