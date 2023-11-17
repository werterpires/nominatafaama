import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  Put
} from '@nestjs/common'
import { VacanciesService } from '../services/vacancies.service'
import {
  CreateDirectVacancyDto,
  CreateVacancyDto
} from '../dto/create-vacancy.dto'
import { UpdateVacancyDto } from '../dto/update-vacancy.dto'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { CreateVacancyStudentDto } from '../dto/create-vacancy-student.dto'
import { UpdateVacancyStudentDto } from '../dto/update-vacancy-student.dto'

@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Post('direct')
  async createDirectVacancy(
    @Body() createVacancyDto: CreateDirectVacancyDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const newVacancy = await this.vacanciesService.createDirectVacancy(
        createVacancyDto,
        currentUser
      )
      return newVacancy
    } catch (error) {
      console.error(
        'erro capturado em createDirectVacancy em Vacanciescontroller'
      )
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Post('')
  async createVacancy(
    @Body() createVacancyDto: CreateVacancyDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    console.log('estou aqui')
    try {
      const newVacancy = await this.vacanciesService.createVacancy(
        createVacancyDto,
        currentUser
      )
      return newVacancy
    } catch (error) {
      console.error('erro capturado em createVacancy em Vacanciescontroller')
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Post('')
  async addStudentToVacancy(
    @Body() createVacancyStudent: CreateVacancyStudentDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const newVacancyStudent = await this.vacanciesService.addStudentToVacancy(
        createVacancyStudent,
        currentUser
      )
      return newVacancyStudent
    } catch (error) {
      console.error(
        'erro capturado em addStudentToVacancy em Vacanciescontroller'
      )
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Put('')
  async updateVacancy(
    @Body() updateVacancyDto: UpdateVacancyDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const updatedVacancy = await this.vacanciesService.udpateVacancyById(
        updateVacancyDto,
        currentUser
      )
      return updateVacancyDto
    } catch (error) {
      console.error('erro capturado em updateVacancy em Vacanciescontroller')
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Put('')
  async updateVacancyStudent(
    @Body() updateVacancyStudentDto: UpdateVacancyStudentDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const updatedVacancyStudent =
        await this.vacanciesService.udpateVacancyStudentById(
          updateVacancyStudentDto,
          currentUser
        )
      return updatedVacancyStudent
    } catch (error) {
      console.error(
        'erro capturado em updateVacancyStudent em Vacanciescontroller'
      )
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Delete(':vacancyId')
  async deleteVacancy(
    @Param('vacancyId') vacancyId: string,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const updatedVacancy = await this.vacanciesService.deleteVacancyById(
        parseInt(vacancyId.toString()),
        currentUser
      )
      return updatedVacancy
    } catch (error) {
      console.error('erro capturado em updateVacancy em Vacanciescontroller')
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Get('students/:nominataId')
  async getAllStudentsWithNoAccepts(
    @Param('nominataId') nominataId: string,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const students =
        await this.vacanciesService.findAllStudentsWithNoAcceptsByNominataId(
          currentUser,
          Number(nominataId)
        )
      return students
    } catch (error) {
      console.error('erro capturado em updateVacancy em Vacanciescontroller')
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Get(':nominataId')
  async getRepVacanciesByNominataId(
    @Param('nominataId') nominataId: string,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const vacancies =
        await this.vacanciesService.findRepVacanciesByNominataId(
          currentUser,
          Number(nominataId)
        )
      return vacancies
    } catch (error) {
      console.error('erro capturado em updateVacancy em Vacanciescontroller')
      throw new InternalServerErrorException(error.message)
    }
  }
}
