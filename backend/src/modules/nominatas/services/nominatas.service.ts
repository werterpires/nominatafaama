import { Injectable } from '@nestjs/common'
import { CreateNominataDto } from '../dto/create-nominata.dto'
import { UpdateNominataDto } from '../dto/update-nominata.dto'
import { NominatasModel } from '../model/nominatas.model'
import { ICreateNominata, INominata, IUpdateNominata } from '../types/types'

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

  async findNominataByYear(year: string): Promise<INominata> {
    try {
      const nominata = await this.nominatasModel.findNominataByYear(year)
      if (nominata) {
        const { nominata_id } = nominata
      }

      return nominata as INominata
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar uma nominata com ano ${year}: ${error.message}`,
      )
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
