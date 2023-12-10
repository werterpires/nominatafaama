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
import { StudentsService } from '../services/students.service'
import { CreateStudentDto } from '../dto/create-student.dto'
import { StringArray, UpdateStudentDto } from '../dto/update-student.dto'
import { IsPublic } from 'src/shared/auth/decorators/is-public.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Post()
  async createStudent(
    @Body() input: CreateStudentDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const userId = currentUser.user_id
      const student = await this.studentsService.createStudent(
        input,
        userId,
        currentUser
      )
      return student
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DIRECAO, ERoles.SECRETARIA)
  @Get('active')
  async findActiveStudents() {
    try {
      return await this.studentsService.findAllActivStudents()
    } catch (error) {
      console.error(error.message)
      throw error
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('edit')
  async getStudentByIdToEdit(@CurrentUser() user: UserFromJwt) {
    const id = user.user_id

    try {
      const student = await this.studentsService.findStudentByIdToEdit(id)
      return student
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DIRECAO)
  @Get('approve/:userId')
  async getStudentByIdToApprove(
    @CurrentUser() user: UserFromJwt,
    @Param('userId') userId: string
  ) {
    try {
      const student = await this.studentsService.findStudentByIdToEdit(+userId)
      return student
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('marital-status')
  async getStudentMaritalStatus(@CurrentUser() user: UserFromJwt) {
    const userId = user.user_id

    try {
      const maritalStatus =
        await this.studentsService.findStudentMaritalStatusById(userId)
      return maritalStatus
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('marital-status/:userId')
  async getStudentMaritalStatusToApprove(
    @CurrentUser() user: UserFromJwt,
    @Param('userId') userId: string
  ) {
    try {
      const maritalStatus =
        await this.studentsService.findStudentMaritalStatusById(+userId)
      return maritalStatus
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @IsPublic()
  @Get(':studentId')
  async getOneStudent(@Param('studentId') studentId: string) {
    try {
      const id = parseInt(studentId.toString())

      const student = await this.studentsService.findOneStudent(id)
      return student
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @IsPublic()
  @Get()
  async findAllStudents() {
    return await this.studentsService.findAllStudents()
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE, ERoles.DIRECAO)
  @Put()
  async updateStudent(
    @Body() input: UpdateStudentDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const updatedStudent = await this.studentsService.updateStudentById(
        input,
        currentUser
      )
      return updatedStudent
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Put('active')
  async turnActiveStudentsFalse(
    @Body() activeCpfs: StringArray,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      await this.studentsService.turnStudentsActiveToFalse(
        activeCpfs,
        currentUser
      )
      return true
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.ESTUDANTE)
  @Delete(':id')
  async deleteStudentById(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const message = await this.studentsService.deleteStudentById(
        id,
        currentUser
      )
      return { message }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
