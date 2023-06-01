import { Injectable } from '@nestjs/common'
import {
  IStudentPhoto,
  ICreateStudentPhoto,
  IUpdateStudentPhoto,
} from '../types/types'
import { StudentPhotosModel } from '../model/student-photos.model'
import { StudentsModel } from 'src/modules/students/model/students.model'
import { CreateStudentPhotoDto } from '../dto/create-student-photo.dto'

@Injectable()
export class StudentPhotosService {
  constructor(
    private studentPhotosModel: StudentPhotosModel,
    private studentModel: StudentsModel,
  ) {}

  async createStudentPhoto(
    dto: CreateStudentPhotoDto,
    userId: number,
  ): Promise<IStudentPhoto> {
    const { student_id } = await this.studentModel.findStudentByUserId(userId)
    const createStudentPhotoData: ICreateStudentPhoto = {
      ...dto,
      student_id,
    }
    try {
      const newStudentPhoto = await this.studentPhotosModel.createStudentPhoto(
        createStudentPhotoData,
      )
      return newStudentPhoto
    } catch (error) {
      throw error
    }
  }

  async findStudentPhotoById(id: number): Promise<IStudentPhoto | null> {
    try {
      const studentPhoto = await this.studentPhotosModel.findStudentPhotoById(
        id,
      )
      return studentPhoto
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar a foto do estudante com o ID ${id}: ${error.message}`,
      )
    }
  }

  async findStudentPhotoByStudentId(
    userId: number,
  ): Promise<IStudentPhoto | null> {
    try {
      const { student_id } = await this.studentModel.findStudentByUserId(userId)
      const studentPhoto =
        await this.studentPhotosModel.findStudentPhotoByStudentId(student_id)
      return studentPhoto
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar a foto do estudante com o ID ${userId}: ${error.message}`,
      )
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

  async updateStudentPhotoById(
    updateStudentPhoto: IUpdateStudentPhoto,
  ): Promise<IStudentPhoto> {
    try {
      await this.studentPhotosModel.updateStudentPhotoById(updateStudentPhoto)
      const updatedStudentPhoto = this.studentPhotosModel.findStudentPhotoById(
        updateStudentPhoto.photo_pack_id,
      )

      if (updateStudentPhoto == null) {
        throw new Error('No photos found')
      }
      return updatedStudentPhoto
    } catch (error) {
      throw error
    }
  }

  async deleteStudentPhotoById(id: number): Promise<string> {
    try {
      await this.studentPhotosModel.deleteStudentPhotoById(id)
      return 'Foto do estudante deletada com sucesso.'
    } catch (error) {
      throw error
    }
  }
}
