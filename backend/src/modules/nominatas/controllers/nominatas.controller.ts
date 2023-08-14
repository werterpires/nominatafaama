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
import { NominatasService } from '../services/nominatas.service'
import { CreateNominataDto } from '../dto/create-nominata.dto'
import { UpdateNominataDto } from '../dto/update-nominata.dto'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { IsPublic } from 'src/shared/auth/decorators/is-public.decorator'
import { ISinteticProfessor, ISinteticStudent } from '../types/types'
import { UpdateNominataStudentsDto } from '../dto/update-nominata-students.dto'
import { UpdateNominataProfessorsDto } from '../dto/update-nominata-professors.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'
import { UserFromJwt } from 'src/shared/auth/types/types'

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

  @Roles(ERoles.ADMINISTRACAO, ERoles.DOCENTE, ERoles.DIRECAO)
  @Post('photo/:nominataId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/modules/nominatas/files',
        filename: (req, file, cb) => {
          const originalFileName = file.originalname

          const uniqueName = `${originalFileName.slice(
            0,
            -4,
          )}${new Date()}${extname(originalFileName)}`
          cb(null, uniqueName)
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
          cb(null, true)
        } else {
          cb(new Error('Apenas arquivos PNGs e JPEG são permitidos.'), false)
        }
      },
    }),
  )
  async uploadFotos(
    @UploadedFile() file: Express.Multer.File,
    @Param('nominataId') nominataId: string,
  ): Promise<null | number> {
    try {
      const nominataPhoto = await this.nominatasService.createNominataPhoto(
        parseInt(nominataId.toString()),
        file.filename,
      )

      return nominataPhoto
    } catch (error) {
      throw new Error(error.message)
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

  @Roles(ERoles.ADMINISTRACAO, ERoles.DOCENTE)
  @Get('photo/:nominataId')
  async getPhoto(@Res() res: any, @Param('nominataId') nominataId: string) {
    try {
      const result = await this.nominatasService.findNominataPhotoByNominataId(
        parseInt(nominataId.toString()),
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
