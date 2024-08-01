import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import { INominataPhoto, ICreateNominataPhoto } from './types'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { NominataPhoto } from './entities/nominata-photo.entity'

@Injectable()
export class NominatasModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async createNominataPhoto(
    nominataPhotoData: ICreateNominataPhoto,
    user: UserFromJwt
  ): Promise<INominataPhoto> {
    try {
      const [photoId] = await this.knex('nominata_photos').insert(
        nominataPhotoData
      )

      await this.notificationsService.createNotification({
        notificationType: 8,
        action: 'criou',
        agent_name: user.name,
        agentUserId: user.user_id,
        newData: { photo: nominataPhotoData.photo },
        table: 'Foto da nominata',
        objectUserId: null,
        oldData: null
      })

      return this.findNominataPhotoById(photoId)
    } catch (error) {
      throw error
    }
  }

  async findNominataPhotoById(
    nominataPhotoId: number
  ): Promise<INominataPhoto> {
    let nominataPhoto: INominataPhoto

    try {
      const result = await this.knex
        .table('nominata_photos')
        .where('nominata_photo_id', '=', nominataPhotoId)
        .first()

      nominataPhoto = {
        nominata_photo_id: result.nominata_photo_id,
        nominata_id: result.nominata_id,
        photo: result.photo
      }

      return nominataPhoto
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async findNominataPhotosByNominataId(
    nominataId: number
  ): Promise<NominataPhoto[]> {
    let nominataPhotos: INominataPhoto[] = []

    try {
      const result = await this.knex
        .table('nominata_photos')
        .where('nominata_id', '=', nominataId)

      nominataPhotos = result.reduce((acc, nominataPhoto) => {
        acc.push({
          nominata_photo_id: nominataPhoto.nominata_photo_id,
          nominata_id: nominataPhoto.nominata_id,
          photo: nominataPhoto.photo
        })
        return acc
      }, [])

      return nominataPhotos
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
