import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, NotFoundException, Put } from '@nestjs/common';
import { StudentsService } from '../services/students.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { IsPublic } from 'src/shared/auth/decorators/is-public.decorator';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator';
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/shared/auth/types/types';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Post()
  async createStudent(@Body() input: CreateStudentDto, @CurrentUser() user:UserFromJwt) {
   
    try {
      const userId = user.user_id
      const student = await this.studentsService.createStudent(input, userId);
      return student;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('edit')
  async getStudentByIdToEdit(@CurrentUser() user:UserFromJwt) {
    const id = user.user_id
    console.log(user)

    try {
      const student = await this.studentsService.findStudentByIdToEdit(id);
      if (!student) {

        throw new NotFoundException(`Student with id ${id} not found.`);
      }
      return student;
    } catch (error) {
 
      throw new InternalServerErrorException(error.message);
    }
  }

  @IsPublic()
  @Get()
  async findAllStudents() {
    return await this.studentsService.findAllStudents();
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Put()
  async updateStudent(@Body() input: UpdateStudentDto) {
    try {
      const updatedStudent = await this.studentsService.updateStudentById(input);
      return updatedStudent;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.ESTUDANTE)
  @Delete(':id')
  async deleteStudentById(@Param('id') id: number) {
    try {
      const message = await this.studentsService.deleteStudentById(id);
      return { message };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
