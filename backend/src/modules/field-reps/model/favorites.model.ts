import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'

import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { IFieldRep, ISetFav, IUpdateFieldRep } from '../types/types'

@Injectable()
export class FavoritesModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async setFavorite(
    setFavData: ISetFav,
    currentUser: UserFromJwt
  ): Promise<number[]> {
    try {
      await this.knex('favorites')
        .insert({
          student_id: setFavData.studentId,
          rep_id: setFavData.repId
        })
        .returning('fieldRep_id')

      return await this.findRepFavorites(setFavData.repId)
    } catch (error) {
      console.error(error)
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('FieldRep já existe')
      } else {
        throw new Error(error.sqlMessage)
      }
    }
  }

  async findRepFavorites(repId: number): Promise<number[]> {
    const result = await this.knex
      .table('favorites')
      .select('student_id')
      .where('favorites.rep_id', '=', repId)

    if (!result) {
      throw new Error('FieldRep não encontrado')
    }

    const favorites: number[] = result.map((item) => item.student_id)

    return favorites
  }

  async setNotFavorite(setFavData: ISetFav): Promise<number[]> {
    try {
      await this.knex('favorites')
        .where('rep_id', setFavData.repId)
        .andWhere('student_id', setFavData.studentId)
        .del()

      return await this.findRepFavorites(setFavData.repId)
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }
}
