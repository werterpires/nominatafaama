import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateNominataPhotoDto } from './dto/create-nominata-photo.dto'
import { UpdateNominataPhotoDto } from './dto/update-nominata-photo.dto'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { NominatasModel } from '../nominatas/model/nominatas.model'
import { INominata } from '../nominatas/types/types'
import { NominatasPhotosModel } from './nominata-photos.model'
import { ICreateNominataPhoto } from './types'

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
      const nominata: INominata | null =
        await this.nominatasModel.findNominataById(nominataId)

      if (!nominata) {
        throw new BadRequestException('Nominata não encontrada')
      }

      if (nominata.class_photo.length >= 5) {
        throw new BadRequestException('#Limite de fotos alcançado. ')
      }

      const createNominataPhotoData: ICreateNominataPhoto = {
        nominata_id: nominataId,
        photo: filename
      }

      this.nominataPhotosModel.createNominataPhoto(
        createNominataPhotoData,
        currentUser
      )
    } catch (error) {
      console.error(
        'Erro capturado no NominataPhotosService createNominataPhoto: ',
        error
      )
      throw error
    }
  }
}
