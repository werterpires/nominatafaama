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
import { ProfessorsService } from '../services/professors.service'
import { IsPublic } from 'src/shared/auth/decorators/is-public.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { CreateProfessorAssignmentDto } from '../dto/create-professors.dto'
import { UpdateProfessorAssgnmentDto } from '../dto/update-professors.dto'

@Controller('professors')
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.DOCENTE)
  @Post()
  async createStudent(
    @Body() input: CreateProfessorAssignmentDto,
    @CurrentUser() user: UserFromJwt,
  ) {
    try {
      const userId = user.user_id
      const professor = await this.professorsService.createProfessor(
        input,
        userId,
      )
      return professor
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DOCENTE)
  @Get('edit')
  async getProfessorByIdToEdit(@CurrentUser() user: UserFromJwt) {
    const id = user.user_id

    try {
      const professor = await this.professorsService.findProfessorByIdToEdit(id)
      return professor
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // @IsPublic()
  // @Get()
  // async findAllStudents() {
  //   return await this.studentsService.findAllStudents()
  // }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DOCENTE)
  @Put()
  async updateProfessor(@Body() input: UpdateProfessorAssgnmentDto) {
    try {
      const updatedProfessor = await this.professorsService.updateProfessorById(
        input,
      )
      return updatedProfessor
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.ESTUDANTE)
  // @Delete(':id')
  // async deleteStudentById(@Param('id') id: number) {
  //   try {
  //     const message = await this.studentsService.deleteStudentById(id)
  //     return { message }
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message)
  //   }
  // }
}
