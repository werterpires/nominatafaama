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
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common'
import { ProfessorsService } from '../services/professors.service'
import { IsPublic } from 'src/shared/auth/decorators/is-public.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { CreateProfessorAssignmentDto } from '../dto/create-professors.dto'
import { UpdateProfessorAssgnmentDto } from '../dto/update-professors.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'

@Controller('professors')
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.DOCENTE)
  @Post()
  async createProfessor(
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

  @Roles(ERoles.ADMINISTRACAO, ERoles.DOCENTE, ERoles.DIRECAO)
  @Post('photo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/modules/professors/files',
        filename: (req, file, cb) => {
          const originalFileName = file.originalname

          const uniqueName = `${originalFileName.slice(
            0,
            -4,
          )}${new Date()}${extname(originalFileName)}`
          cb(null, uniqueName)

          console.log(uniqueName)
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
    @CurrentUser() user: UserFromJwt,
  ): Promise<null | number> {
    try {
      const user_id = user.user_id
      const studentPhoto = await this.professorsService.createProfessorPhoto(
        user_id,
        file.filename,
      )

      return studentPhoto
    } catch (error) {
      throw new Error(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DOCENTE)
  @Get('photo')
  async getPhoto(
    @CurrentUser() user: UserFromJwt,
    @Res() res: any,
    @Param('photoType') phototype: string,
  ) {
    try {
      const userId = user.user_id
      const result = await this.professorsService.findProfessorPhotoByUserId(
        userId,
      )

      if (result == null) {
        res.status(404).json({ error: 'Foto não encontrada.' })
      }
      const { fileStream, headers } = result

      if (fileStream) {
        Object.entries(headers).forEach(([key, value]) => {
          res.set(key, value)
        })
        console.log('cheguei bem até aqui.')
        fileStream.pipe(res)
      } else {
        res.status(404).json({ error: 'Foto não encontrada.' })
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao recuperar a foto.' })
    }
  }
}
