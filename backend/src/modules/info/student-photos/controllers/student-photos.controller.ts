import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
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

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Post(':photoType')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/modules/info/student-photos/files',
        filename: (req, file, cb) => {
          // Salvar o nome original do arquivo em uma variável antes de modificar o nome
          const originalFileName = file.originalname

          const uniqueName = `${originalFileName.slice(0, -4)}${extname(
            originalFileName,
          )}`
          cb(null, uniqueName)

          console.log(originalFileName)
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
  ): Promise<null | number> {
    try {
      const studentPhoto = await this.studentPhotosService.createStudentPhoto(
        file.filename,
        file.originalname,
      )

      return studentPhoto
    } catch (error) {
      throw new Error(error.message)
    }
  }

  // @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  // @Post(':photoType')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './src/modules/info/student-photos/files',
  //       filename: (req, file, cb) => {
  //         const uniqueName = `studentphoto_${Date.now()}${extname(
  //           file.originalname,
  //         )}`
  //         cb(null, uniqueName)
  //       },
  //     }),
  //     fileFilter: (req, file, cb) => {
  //       if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
  //         cb(null, true)
  //       } else {
  //         cb(new Error('Apenas arquivos PNG e JPEG são permitidos.'), false)
  //       }
  //     },
  //   }),
  // )
  // async uploadFotos(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() createStudentPhotoDto: Express.Multer.File,
  //   @Param('photoType') photoType: string,
  //   @CurrentUser() user: UserFromJwt,
  // ): Promise<IStudentPhoto | null> {
  //   try {
  //     const user_id = user.user_id
  //     const studentPhoto = this.studentPhotosService.createStudentPhoto(
  //       user_id,
  //       photoType,
  //       file.filename,
  //     )

  //     return studentPhoto
  //   } catch (error) {
  //     throw new Error(error.message)
  //   }
  // }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('student/:photoType')
  async getPhoto(
    @CurrentUser() user: UserFromJwt,
    @Res() res: any,
    @Param('photoType') phototype: string,
  ) {
    try {
      const userId = user.user_id
      const result =
        await this.studentPhotosService.findStudentPhotoByStudentId(
          userId,
          phototype,
        )
      if (result == null) {
        res.status(404).json({ error: 'Foto não encontrada.' })
      }
      const { fileStream, headers } = result

      if (fileStream) {
        Object.entries(headers).forEach(([key, value]) => {
          res.set(key, value)
        })
        fileStream.pipe(res)
      } else {
        res.status(404).json({ error: 'Foto não encontrada.' })
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao recuperar a foto.' })
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
