import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateNominataPhotoDto } from './dto/create-nominata-photo.dto'
import { UpdateNominataPhotoDto } from './dto/update-nominata-photo.dto'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { NominatasModel } from '../nominatas/model/nominatas.model'
import { INominata } from '../nominatas/types/types'
import { NominatasPhotosModel } from './nominata-photos.model'
import { ICreateNominataPhoto } from './types'
import * as fs from 'fs'

@Injectable()
export class NominataPhotosService {
  constructor(
    private nominatasModel: NominatasModel,
    private nominataPhotosModel: NominatasPhotosModel
  ) {}
  async createNominataPhoto(
    nominataId: number,
    filename: string,
    currentUser: UserFromJwt
  ) {
    try {
      const sanitizedFilename = filename.replace(/[^a-zA-Z0-9-_\.~]/g, '')
      const filePath = `src/modules/nominatas/files/${sanitizedFilename}`
      const nominata: INominata | null =
        await this.nominatasModel.findNominataById(nominataId)

      if (!nominata) {
        await fs.promises.unlink(filePath)
        throw new BadRequestException('#Nominata não encontrada')
      }

      if (nominata.class_photo.length >= 5) {
        await fs.promises.unlink(filePath)
        throw new BadRequestException('#Limite de fotos alcançado. ')
      }

      const createNominataPhotoData: ICreateNominataPhoto = {
        nominata_id: nominataId,
        photo: sanitizedFilename
      }

      const photo = await this.nominataPhotosModel.createNominataPhoto(
        createNominataPhotoData,
        currentUser
      )

      return photo
    } catch (error) {
      console.error(
        'Erro capturado no NominataPhotosService createNominataPhoto: ',
        error
      )
      throw error
    }
  }

  async findNominataPhotoByFileName(fileName: string) {
    try {
      const filePath = `src/modules/nominatas/files/${fileName}`

      if (fs.existsSync(filePath)) {
        const fileStream = fs.createReadStream(filePath)
        const headers = {
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `attachment; filename=${fileName}`
        }

        return { fileStream, headers }
      } else {
        return { fileStream: null, headers: null }
      }
    } catch (error) {
      console.error(
        'Erro capturado no NominataPhotosService findNominataPhotoByFileName: ',
        error
      )
      throw error
    }
  }

  async findNominataPhotoByNominataId(nominataId: number) {
    try {
      const nominataPhotos =
        await this.nominataPhotosModel.findNominataPhotosByNominataId(
          nominataId
        )

      return nominataPhotos
    } catch (error) {
      console.error(
        'Erro capturado no NominataPhotosService findNominataPhotoByNominataId: ',
        error
      )
      throw error
    }
  }

  async deleteNominataPhotoById(nominataPhotoId: number) {
    try {
      const photo = await this.nominataPhotosModel.findNominataPhotoById(
        nominataPhotoId
      )

      if (!photo) {
        throw new BadRequestException('#Foto não encontrada')
      }

      const filePath = `src/modules/nominatas/files/${photo.photo}`
      await fs.promises.unlink(filePath)
      await this.nominataPhotosModel.deleteNominataPhotoById(nominataPhotoId)
    } catch (error) {
      console.error(
        'Erro capturado no NominataPhotosService deleteNominataPhotoById: ',
        error
      )
      throw error
    }
  }
}
