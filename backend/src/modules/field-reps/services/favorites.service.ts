import { Injectable } from '@nestjs/common'
import { UpdateFieldRepDto } from '../dto/update-field-rep.dto'
import { UsersService } from 'src/modules/users/dz_services/users.service'
import { UserFromJwt } from 'src/shared/auth/types/types'
import {
  ICreateFieldRep,
  IFieldRep,
  ISetFav,
  IUpdateFieldRep
} from '../types/types'
import { FavoritesModel } from '../model/favorites.model'
import { SetFavDto } from '../dto/set-fav.dto'
import { FieldRepsModel } from '../model/field-reps.model'

@Injectable()
export class FavoritesService {
  constructor(
    private favoritesModel: FavoritesModel,
    private fieldRepModel: FieldRepsModel,
    private usersService: UsersService
  ) {}

  async setFavorite(
    dto: SetFavDto,
    currentUser: UserFromJwt
  ): Promise<number[]> {
    try {
      const repId = (
        await this.fieldRepModel.findFieldRepByUserId(currentUser.user_id)
      )?.repId
      if (repId == null) {
        throw new Error('Nenhum representante de campo válido foi encontrado.')
      }

      const setFavData: ISetFav = {
        repId: repId,
        studentId: dto.studentId
      }

      const favs = await this.favoritesModel.setFavorite(
        setFavData,
        currentUser
      )
      return favs
    } catch (error) {
      throw error
    }
  }

  async findRepFavorites(currentUser: UserFromJwt): Promise<number[]> {
    try {
      const repId = (
        await this.fieldRepModel.findFieldRepByUserId(currentUser.user_id)
      )?.repId
      if (repId == null) {
        throw new Error('Nenhum representante de campo válido foi encontrado.')
      }
      console.log(repId)
      return await this.favoritesModel.findRepFavorites(repId)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async setNotFavorite(
    studentId: number,
    currentUser: UserFromJwt
  ): Promise<number[]> {
    try {
      const repId = (
        await this.fieldRepModel.findFieldRepByUserId(currentUser.user_id)
      )?.repId
      if (repId == null) {
        throw new Error('Nenhum representante de campo válido foi encontrado.')
      }

      const setFavData: ISetFav = {
        repId: repId,
        studentId: studentId
      }

      const favs = await this.favoritesModel.setNotFavorite(setFavData)
      return favs
    } catch (error) {
      throw error
    }
  }
}
