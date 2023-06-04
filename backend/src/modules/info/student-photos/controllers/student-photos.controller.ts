import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { CreateStudentPhotoDto } from '../dto/create-student-photo.dto'
import { UpdateStudentPhotoDto } from '../dto/update-student-photo.dto'
import { IOnePhotoAddress, IStudentPhoto } from '../types/types'
import { StudentPhotosService } from '../services/student-photos.service'
import { ExpressAdapter, FileInterceptor } from '@nestjs/platform-express'
import { extname } from 'path'
import { diskStorage } from 'multer'

@Controller('student-photos')
export class StudentPhotosController {
  constructor(private studentPhotosService: StudentPhotosService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Post(':photoType')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/modules/info/student-photos/files',
        filename: (req, file, cb) => {
          const uniqueName = `fotomuitolegal_${Date.now()}${extname(
            file.originalname,
          )}`
          cb(null, uniqueName)
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
          cb(null, true)
        } else {
          cb(new Error('Apenas arquivos PNG e JPEG são permitidos.'), false)
        }
      },
    }),
  )
  async uploadFotos(
    @UploadedFile() file: Express.Multer.File,
    @Body() createStudentPhotoDto: Express.Multer.File,
    @Param('photoType') photoType: string,
    @CurrentUser() user: UserFromJwt,
  ): Promise<IStudentPhoto | null> {
    try {
      const user_id = user.user_id
      console.log(photoType)
      const studentPhoto = this.studentPhotosService.createStudentPhoto(
        user_id,
        photoType,
        file.filename,
      )

      return studentPhoto
    } catch (error) {
      throw new Error(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('student')
  async findStudentPhotoByStudentId(
    @CurrentUser() user: UserFromJwt,
  ): Promise<IStudentPhoto | null> {
    try {
      const { user_id } = user
      const studentPhoto =
        await this.studentPhotosService.findStudentPhotoByStudentId(user_id)

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
