import { Injectable } from '@nestjs/common'
import {
  IStudentPhoto,
  ICreateStudentPhoto,
  IUpdateStudentPhoto,
  IOnePhotoAddress
} from '../types/types'
import { StudentPhotosModel } from '../model/student-photos.model'
import { StudentsModel } from 'src/modules/students/model/students.model'
import { CreateStudentPhotoDto } from '../dto/create-student-photo.dto'
import * as fs from 'fs'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class StudentPhotosService {
  constructor(
    private studentPhotosModel: StudentPhotosModel,
    private studentModel: StudentsModel
  ) {}

  async createStudentPhoto(
    filename: string,
    data: string,
    currentUser: UserFromJwt
  ): Promise<null | number> {
    try {
      const cpf = data.slice(0, 11)
      const remaining = data.slice(11)
      const parts = remaining.split('.')
      const photoType = parts[0]

      const student = await this.studentModel.findStudentByUserCpf(cpf)

      if (student == null) {
        const filePath = `./src/modules/info/student-photos/files/${filename}`
        fs.unlinkSync(filePath)
        return 0
      }
      const student_id = student.student_id
      const photoTypes: string[] = [
        'alone_photo',
        'family_photo',
        'other_family_photo',
        'spouse_photo',
        'invite_photo',
        'small_alone_photo'
      ]

      let photoValues: (string | null)[] = [null, null, null, null, null, null]

      const photoTypeIndex = photoTypes.indexOf(photoType)

      photoValues[photoTypeIndex] = filename

      let createStudentPhotoData: ICreateStudentPhoto = {
        student_id,
        alone_photo: photoValues[0],
        family_photo: photoValues[1],
        other_family_photo: photoValues[2],
        spouse_photo: photoValues[3],
        invite_photo: photoValues[4],
        small_alone_photo: photoValues[5]
      }

      const existing =
        await this.studentPhotosModel.findStudentPhotoByStudentId(student_id)

      if (!existing) {
        this.studentPhotosModel.createStudentPhoto(
          createStudentPhotoData,
          'create',
          currentUser
        )
      } else {
        let correctPhotoType = photoType.replace(/-/g, '_')
        if (existing[correctPhotoType] != null) {
        }

        this.studentPhotosModel.createStudentPhoto(
          createStudentPhotoData,
          'update',
          currentUser
        )
      }

      const createdStudentPhoto =
        await this.studentPhotosModel.findStudentPhotoByStudentId(student_id)

      return 1
    } catch (error) {
      console.error(
        'Erro capturado no StudentPhotosService createStudentPhoto: ',
        error
      )
      throw error
    }
  }

  async findStudentPhotoById(id: number): Promise<IStudentPhoto | null> {
    try {
      const studentPhoto = await this.studentPhotosModel.findStudentPhotoById(
        id
      )
      return studentPhoto
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar a foto do estudante com o ID ${id}: ${error.message}`
      )
    }
  }

  async findStudentPhotoByStudentId(
    user_id: number,
    photoType: string
  ): Promise<{
    fileStream: fs.ReadStream | null
    headers: Record<string, string>
  }> {
    try {
      const student = await this.studentModel.findStudentByUserId(user_id)
      if (student == null) {
        return {
          fileStream: null,
          headers: {
            'Content-Type': 'image/jpeg',
            'Content-Disposition': `attachment; filename`
          }
        }
      }
      const student_id = student.student_id
      if (!student_id) {
        throw new Error('Usuário não possui um estudante válido')
      }

      const photoNames =
        await this.studentPhotosModel.findStudentPhotoByStudentId(student_id)

      if (!photoNames) {
        return { fileStream: null, headers: {} }
      }

      const photosProperty = photoType.replace(/-/g, '_')

      const filename = photoNames[photosProperty]

      const filePath = `./src/modules/info/student-photos/files/${filename}`

      if (fs.existsSync(filePath)) {
        const fileStream = fs.createReadStream(filePath)
        const headers = {
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `attachment; filename=${filename}`
        }
        return { fileStream, headers }
      } else {
        return { fileStream: null, headers: {} }
      }
    } catch (error) {
      console.error(
        'Erro capturado no StudentPhotosService findStudentPhotoByStudentId: ',
        error
      )
      throw error
    }
  }

  async findStudentPublicPhotoByStudentId(
    studentId: number,
    photoType: string
  ): Promise<{
    fileStream: fs.ReadStream | null
    headers: Record<string, string>
  }> {
    try {
      // const student = await this.studentModel.findStudentByUserId(user_id)
      // if (student == null) {
      //   return {
      //     fileStream: null,
      //     headers: {
      //       'Content-Type': 'image/jpeg',
      //       'Content-Disposition': `attachment; filename`,
      //     },
      //   }
      // }
      // const student_id = student.student_id
      // if (!student_id) {
      //   throw new Error('Usuário não possui um estudante válido')
      // }

      const photoNames =
        await this.studentPhotosModel.findStudentPhotoByStudentId(studentId)

      if (!photoNames) {
        return { fileStream: null, headers: {} }
      }

      const photosProperty = photoType.replace(/-/g, '_')

      const filename = photoNames[photosProperty]

      const filePath = `./src/modules/info/student-photos/files/${filename}`

      if (fs.existsSync(filePath)) {
        const fileStream = fs.createReadStream(filePath)
        const headers = {
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `attachment; filename=${filename}`
        }
        return { fileStream, headers }
      } else {
        return { fileStream: null, headers: {} }
      }
    } catch (error) {
      console.error(
        'Erro capturado no StudentPhotosService findStudentPhotoByStudentId: ',
        error
      )
      throw error
    }
  }

  async findAllStudentPhotos(): Promise<IStudentPhoto[]> {
    try {
      const allStudentPhotos =
        await this.studentPhotosModel.findAllStudentPhotos()
      return allStudentPhotos
    } catch (error) {
      throw error
    }
  }

  // async updateStudentPhotoById(
  //   updateStudentPhoto: IUpdateStudentPhoto
  // ): Promise<IStudentPhoto> {
  //   try {
  //     await this.studentPhotosModel.updateStudentPhotoById(updateStudentPhoto);
  //     const updatedStudentPhoto = this.studentPhotosModel.findStudentPhotoById(
  //       updateStudentPhoto.photo_pack_id
  //     );

  //     if (updateStudentPhoto == null) {
  //       throw new Error('No photos found');
  //     }
  //     return updatedStudentPhoto;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async deleteStudentPhotoById(id: number): Promise<string> {
  //   try {
  //     await this.studentPhotosModel.deleteStudentPhotoById(id);
  //     return 'Foto do estudante deletada com sucesso.';
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
