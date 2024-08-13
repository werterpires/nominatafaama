import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common'
import { NominataPhotosService } from './nominata-photos.service'
import { CreateNominataPhotoDto } from './dto/create-nominata-photo.dto'
import { UpdateNominataPhotoDto } from './dto/update-nominata-photo.dto'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Controller('nominata-photos')
export class NominataPhotosController {
  constructor(private readonly nominataPhotosService: NominataPhotosService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO, ERoles.DESIGN)
  @Post(':nominataId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/modules/nominatas/files',
        filename: (req, file, cb) => {
          const originalFileName = file.originalname

          const uniqueName = `${originalFileName.slice(
            0,
            -4
          )}${new Date()}${extname(originalFileName)}`
          cb(null, uniqueName)
        }
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
          cb(null, true)
        } else {
          cb(new Error('Apenas arquivos PNGs e JPEG são permitidos.'), false)
        }
      }
    })
  )
  async uploadFotos(
    @UploadedFile() file: Express.Multer.File,
    @Param('nominataId') nominataId: string,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    const nominataPhoto = await this.nominataPhotosService.createNominataPhoto(
      +nominataId,
      file.filename,
      currentUser
    )
  }
}
