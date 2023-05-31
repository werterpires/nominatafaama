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
import { CreateStudentPhotoDto } from '../dto/create-student-photo.dto'
import { UpdateStudentPhotoDto } from '../dto/update-student-photo.dto'
import { IStudentPhoto } from '../types/types'
import { StudentPhotosService } from '../services/student-photos.service'

@Controller('student-photos')
export class StudentPhotosController {
  constructor(private studentPhotosService: StudentPhotosService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Post()
  async createStudentPhoto(
    @Body() input: CreateStudentPhotoDto,
    @CurrentUser() user: UserFromJwt,
  ): Promise<IStudentPhoto> {
    try {
      const { user_id } = user
      const studentPhoto = await this.studentPhotosService.createStudentPhoto(
        input,
        user_id,
      )
      return studentPhoto
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('student')
  async findStudentPhotoByStudentId(
    @Param('id') id: number,
    @CurrentUser() user: UserFromJwt,
  ): Promise<IStudentPhoto> {
    try {
      const { user_id } = user
      const studentPhoto =
        await this.studentPhotosService.findStudentPhotoByStudentId(user_id)

      if (!studentPhoto) {
        throw new NotFoundException(`No student photo found with id ${id}.`)
      }

      return studentPhoto
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get(':id')
  async findStudentPhotoById(@Param('id') id: number): Promise<IStudentPhoto> {
    try {
      const studentPhoto = await this.studentPhotosService.findStudentPhotoById(
        id,
      )

      if (!studentPhoto) {
        throw new NotFoundException(`No student photo found with id ${id}.`)
      }

      return studentPhoto
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO)
  @Get()
  async findAllStudentPhotos(): Promise<IStudentPhoto[]> {
    try {
      const studentPhotos =
        await this.studentPhotosService.findAllStudentPhotos()
      return studentPhotos
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Put()
  async updateStudentPhotoById(
    @Body() input: UpdateStudentPhotoDto,
  ): Promise<IStudentPhoto> {
    try {
      const updatedStudentPhoto =
        await this.studentPhotosService.updateStudentPhotoById(input)

      if (!updatedStudentPhoto) {
        throw new NotFoundException(`No student photo found.`)
      }

      return updatedStudentPhoto
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO)
  @Delete(':id')
  async deleteStudentPhotoById(@Param('id') id: number): Promise<string> {
    try {
      const message = await this.studentPhotosService.deleteStudentPhotoById(id)
      return message
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
