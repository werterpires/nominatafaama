import { Injectable } from '@nestjs/common'
import { LanguagesModel } from '../model/languages.model'
import { CreateLanguageDto } from '../dto/create-language.dto'
import { UpdateLanguageDto } from '../dto/update-language.dto'
import { ICreateLanguage, ILanguage, IUpdateLanguage } from '../types/types'
import { UsersService } from 'src/modules/users/dz_services/users.service'
import { SpousesModel } from 'src/modules/spouses/model/spouses.model'
import { ISpouse } from 'src/modules/spouses/types/types'

@Injectable()
export class LanguagesService {
  constructor(
    private languagesModel: LanguagesModel,
    private usersService: UsersService,
    private spouseModel: SpousesModel,
  ) {}

  async createLanguage(
    dto: CreateLanguageDto,
    user_id: number,
    personType: string,
  ): Promise<ILanguage> {
    try {
      let personId!: number
      if (personType === 'student') {

        const user = await this.usersService.findUserById(user_id)
        
        if(user != null){
          personId = user.person_id
        }else{
          throw new Error(`Não foi possível encontrar um usuário válido.`)
        }
      } else if (personType === 'spouse') {
        let spouse: ISpouse | null = await this.spouseModel.findSpouseByUserId(
          user_id,
        )
        if (spouse == null) {
          throw new Error(
            `Não foi possível encontrar uma esposa vinculada ao usuário com id ${user_id}`,
          )
        }
        personId = spouse.person_id
      }
      const createLanguageData: ICreateLanguage = {
        ...dto,
        person_id: personId,
        language_approved: null,
      }
      const newLanguage = await this.languagesModel.createLanguage(
        createLanguageData,
      )
      return newLanguage
    } catch (error) {
      throw error
    }
  }

  async findLanguageById(id: number): Promise<ILanguage | null> {
    try {
      const language = await this.languagesModel.findLanguageById(id)
      return language
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar o idioma com o ID ${id}: ${error.message}`,
      )
    }
  }

  async findLanguagesByPersonId(
    user_id: number,
    personType: string,
  ): Promise<ILanguage[] | null> {
    try {
      let personId!: number
      if (personType === 'student') {

        const user = await this.usersService.findUserById(user_id)
        
        if(user != null){
          personId = user.person_id
        }else{
          throw new Error(`Não foi possível encontrar um usuário válido.`)
        }
      } else if (personType === 'spouse') {
        let spouse: ISpouse | null = await this.spouseModel.findSpouseByUserId(
          user_id,
        )
        if (spouse == null) {
          throw new Error(
            `Não foi possível encontrar uma esposa vinculada ao usuário com id ${user_id}`,
          )
        }
        personId = spouse.person_id
      }
      let languages: ILanguage[]
      if(personId==null){
        languages = []
      }else{
        languages =
        await this.languagesModel.findLanguagesByPersonId(
          personId,
        )
      }
      return languages
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar idiomas para a pessoa com o ID fornecido: ${error.message}`,
      )
    }
  }

  async findAllLanguages(): Promise<ILanguage[]> {
    try {
      const allLanguages = await this.languagesModel.findAllLanguages()
      return allLanguages
    } catch (error) {
      throw error
    }
  }

  async updateLanguageById(dto: UpdateLanguageDto): Promise<ILanguage> {
    try {
      const updateLanguageData: IUpdateLanguage = {
        ...dto,
        language_approved: null,
      }

      const updatedLanguage = await this.languagesModel.updateLanguageById(
        updateLanguageData,
      )
      return updatedLanguage
    } catch (error) {
      throw error
    }
  }

  async deleteLanguageById(id: number): Promise<string> {
    try {
      await this.languagesModel.deleteLanguageById(id)
      return 'Idioma deletado com sucesso.'
    } catch (error) {
      throw error
    }
  }
}
