import { Injectable } from '@nestjs/common'
import { CreateNominataDto } from '../dto/create-nominata.dto'
import { UpdateNominataDto } from '../dto/update-nominata.dto'
import { NominatasModel } from '../model/nominatas.model'
import {
  IBasicStudent,
  ICreateNominata,
  ICreateNominataStudents,
  INominata,
  ISinteticStudent,
  IUpdateNominata,
} from '../types/types'
import * as fs from 'fs'

@Injectable()
export class NominatasService {
  constructor(private nominatasModel: NominatasModel) {}
  async createNominata(dto: CreateNominataDto): Promise<INominata> {
    try {
      const createNominataData: ICreateNominata = {
        year: dto.year,
        orig_field_invites_begin: new Date(dto.orig_field_invites_begin),
        director_words: dto.director_words,
      }

      const newNominata = await this.nominatasModel.createNominata(
        createNominataData,
      )
      return newNominata
    } catch (error) {
      throw error
    }
  }

  async addStudentsToNominata(
    createNominataStudentsData: ICreateNominataStudents,
  ): Promise<boolean> {
    try {
      const { nominata_id, student_id } = createNominataStudentsData
      const result = await this.nominatasModel.addStudentsToNominata(
        student_id,
        nominata_id,
      )
      return result
    } catch (error) {
      console.log(error)
      throw new Error(error.message)
    }
  }

  async findNominataByYear(year: string): Promise<INominata> {
    try {
      const nominata = await this.nominatasModel.findNominataByYear(year)
      let photosInfo: {
        fileStream: fs.ReadStream | null
        headers: Record<string, string>
      }[] = []

      if (nominata) {
        const { nominata_id } = nominata
        const students = await this.findNominataBasicStudents(nominata_id)
        nominata.students = students
      }

      return nominata as INominata
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar uma nominata com ano ${year}: ${error.message}`,
      )
    }
  }

  async findNominataBasicStudents(
    nominata_id: number,
  ): Promise<IBasicStudent[] | null> {
    try {
      let students = await this.nominatasModel.findAllNominataBasicStudents(
        nominata_id,
      )
      if (students == null) {
        return null
      }
      for (const student of students) {
        if (student.small_alone_photo == null) {
          student.photo = null
        } else {
          const filePath = `./src/modules/info/student-photos/files/${student.small_alone_photo}`

          if (!fs.existsSync(filePath)) {
            return null
          }
          const fileStream = fs.createReadStream(filePath)
          const headers = {
            'Content-Type': 'image/jpeg',
            'Content-Disposition': `attachment; filename=${student.small_alone_photo}`,
          }

          const filePromise = new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = []
            fileStream.on('data', (chunk: Buffer) => {
              chunks.push(chunk)
            })
            fileStream.on('end', () => {
              const file = Buffer.concat(chunks)
              resolve(file)
            })
            fileStream.on('error', (error: Error) => {
              reject(error)
            })
          })

          const file = await filePromise
          student.photo = {
            file,
            headers,
          }
        }

        // console.log(student.photo)
      }

      return students
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async findAllNominatas(): Promise<INominata[]> {
    try {
      const nominatas = await this.nominatasModel.findAllNominatas()
      return nominatas
    } catch (error) {
      throw error
    }
  }

  async findAllNOminataStudents(): Promise<ISinteticStudent[]> {
    try {
      const students = await this.nominatasModel.findAllNominataStudents()
      return students
    } catch (error) {
      throw error
    }
  }

  async updateNominataById(input: UpdateNominataDto): Promise<INominata> {
    let updatedNominata: INominata | null = null
    let sentError: Error | null = null

    try {
      const updateNominataData: IUpdateNominata = {
        nominata_id: input.nominata_id,
        orig_field_invites_begin: new Date(input.orig_field_invites_begin),
        year: input.year,
        director_words: input.director_words,
      }

      updatedNominata = await this.nominatasModel.updateNominataById(
        updateNominataData,
      )
    } catch (error) {
      sentError = new Error(error.message)
    }

    if (sentError !== null) {
      throw sentError
    }

    if (updatedNominata === null) {
      throw new Error('O grau acadêmico não pôde ser atualizado.')
    }

    return updatedNominata
  }

  async deleteNominataById(id: number): Promise<string> {
    try {
      const message = await this.nominatasModel.deleteNominataById(id)
      return message
    } catch (error) {
      throw error
    }
  }
}
