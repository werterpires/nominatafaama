import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  ICreateStudentPhoto,
  IStudentPhoto,
  IUpdateStudentPhoto,
} from '../types/types'

@Injectable()
export class StudentPhotosModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createStudentPhoto(
    createStudentPhotoData: ICreateStudentPhoto,
  ): Promise<IStudentPhoto> {
    let studentPhoto: IStudentPhoto | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          alone_photo,
          family_photo,
          other_family_photo,
          spouse_photo,
          invite_photo,
          student_id,
        } = createStudentPhotoData

        const [photo_pack_id] = await trx('student_photos')
          .insert({
            alone_photo,
            family_photo,
            other_family_photo,
            spouse_photo,
            invite_photo,
            student_id,
          })
          .returning('photo_pack_id')

        await trx.commit()

        studentPhoto = await this.findStudentPhotoById(photo_pack_id)
      } catch (error) {
        console.error(error)
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('StudentPhoto already exists')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return studentPhoto!
  }

  async findStudentPhotoById(id: number): Promise<IStudentPhoto> {
    let studentPhoto: IStudentPhoto | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('student_photos')
          .where('photo_pack_id', '=', id)
          .first()

        if (!result) {
          throw new Error('StudentPhoto not found')
        }

        studentPhoto = {
          photo_pack_id: result.photo_pack_id,
          alone_photo: result.alone_photo,
          family_photo: result.family_photo,
          other_family_photo: result.other_family_photo,
          spouse_photo: result.spouse_photo,
          invite_photo: result.invite_photo,
          student_id: result.student_id,
          created_at: result.created_at,
          updated_at: result.updated_at,
        }

        await trx.commit()
      } catch (error) {
        console.error(error)
        sentError = new Error(error.message)
        await trx.rollback()
        throw error
      }
    })

    if (sentError) {
      throw sentError
    }
    if (studentPhoto == null) {
      throw new Error('pack not found ')
    }
    return studentPhoto
  }

  async findStudentPhotoByStudentId(
    studentId: number,
  ): Promise<IStudentPhoto | null> {
    let studentPhoto: IStudentPhoto | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('student_photos')
          .where('student_id', '=', studentId)
          .first()

        if (!result) {
          throw new Error('StudentPhoto not found')
        }

        studentPhoto = {
          photo_pack_id: result.photo_pack_id,
          alone_photo: result.alone_photo,
          family_photo: result.family_photo,
          other_family_photo: result.other_family_photo,
          spouse_photo: result.spouse_photo,
          invite_photo: result.invite_photo,
          student_id: result.student_id,
          created_at: result.created_at,
          updated_at: result.updated_at,
        }

        await trx.commit()
      } catch (error) {
        console.error(error)
        sentError = new Error(error.message)
        await trx.rollback()
        throw error
      }
    })

    if (sentError) {
      throw sentError
    }

    return studentPhoto
  }

  async findAllStudentPhotos(): Promise<IStudentPhoto[]> {
    let studentPhotoList: IStudentPhoto[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        studentPhotoList = await trx.table('student_photos').select('*')

        await trx.commit()
      } catch (error) {
        console.error(error)
        sentError = new Error(error.sqlMessage)
        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    return studentPhotoList
  }

  async updateStudentPhotoById(
    updateStudentPhoto: IUpdateStudentPhoto,
  ): Promise<void> {
    let updatedStudentPhoto: IStudentPhoto | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          photo_pack_id,
          alone_photo,
          family_photo,
          other_family_photo,
          spouse_photo,
          invite_photo,
          student_id,
        } = updateStudentPhoto

        await trx('student_photos')
          .where('photo_pack_id', photo_pack_id)
          .update({
            alone_photo,
            family_photo,
            other_family_photo,
            spouse_photo,
            invite_photo,
            student_id,
          })

        await trx.commit()
      } catch (error) {
        console.error(error)
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }
  }

  async deleteStudentPhotoById(id: number): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        const existingStudentPhoto = await trx('student_photos')
          .select('photo_pack_id')
          .where('photo_pack_id', id)
          .first()

        if (!existingStudentPhoto) {
          throw new Error('StudentPhoto not found')
        }

        await trx('student_photos').where('photo_pack_id', id).del()

        await trx.commit()
      } catch (error) {
        console.error(error)
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }
    message = 'StudentPhoto deleted successfully.'
    return message
  }
}
