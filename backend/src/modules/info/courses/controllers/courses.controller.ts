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
import { CoursesService } from '../services/courses.service'
import { NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { CreateCourseDto } from '../dto/create-course.dto'
import { UpdateCourseDto } from '../dto/update-course.dto'
import { ICourse } from '../types/types'

@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Post(':personType')
  async createCourse(
    @Body() input: CreateCourseDto,
    @CurrentUser() currentUser: UserFromJwt,
    @Param('personType') personType: string
  ) {
    try {
      const user_id = currentUser.user_id
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.')
      }
      const course = await this.coursesService.createCourse(
        input,
        user_id,
        personType,
        currentUser
      )
      return course
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('person/:personType')
  async findCoursesByPersonId(
    @CurrentUser() user: UserFromJwt,
    @Param('personType') personType: string
  ): Promise<ICourse[]> {
    try {
      const user_id = user.user_id
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.')
      }
      const courses = await this.coursesService.findCoursesByPersonId(
        user_id,
        personType
      )

      if (!courses) {
        throw new NotFoundException(
          `No courses found for person with id fornecido.`
        )
      }
      return courses
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DIRECAO, ERoles.MINISTERIAL)
  @Get('approve/:personType/:userId')
  async findCoursesByPersonIdToApprove(
    @CurrentUser() user: UserFromJwt,
    @Param('personType') personType: string,
    @Param('userId') userId: string
  ): Promise<ICourse[]> {
    try {
      if (personType !== 'student' && personType !== 'spouse') {
        throw new Error('End point inválido.')
      }
      const courses = await this.coursesService.findCoursesByPersonId(
        +userId,
        personType
      )

      if (!courses) {
        throw new NotFoundException(
          `No courses found for person with id fornecido.`
        )
      }
      return courses
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get(':id')
  async findCourseById(@Param('id') id: number): Promise<ICourse> {
    try {
      const course = await this.coursesService.findCourseById(id)
      if (!course) {
        throw new NotFoundException(`No course found with id ${id}.`)
      }
      return course
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE, ERoles.SECRETARIA)
  @Get()
  async findAllCourses(): Promise<ICourse[]> {
    try {
      const courses = await this.coursesService.findAllCourses()
      return courses
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
  async updateCourseById(
    @Body() input: UpdateCourseDto,
    @CurrentUser() currentUser: UserFromJwt
  ): Promise<ICourse> {
    try {
      const updatedCourse = await this.coursesService.updateCourseById(
        input,
        currentUser
      )
      return updatedCourse
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Delete(':id')
  async deleteCourseById(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const message = await this.coursesService.deleteCourseById(
        id,
        currentUser
      )
      return { message }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
