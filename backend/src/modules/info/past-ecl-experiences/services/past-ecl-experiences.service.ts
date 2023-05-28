import {Injectable} from '@nestjs/common'
import {IPastEclExp, ICreatePastEclExp, IUpdatePastEclExp} from '../types/types'
import {UsersService} from 'src/modules/users/dz_services/users.service'
import {SpousesModel} from 'src/modules/spouses/model/spouses.model'
import {PastEclExpsModel} from '../model/past-ecl-experiences.model'
import {CreatePastEclExpDto} from '../dto/create-past-ecl-experience.dto'
import {UpdatePastEclExpDto} from '../dto/update-past-ecl-experience.dto'

@Injectable()
export class PastEclExpsService {
  constructor(
    private pastEclExpsModel: PastEclExpsModel,
    private usersService: UsersService,
    private spouseModel: SpousesModel,
  ) {}

  async createPastEclExp(
    dto: CreatePastEclExpDto,
    user_id: number,
    personType: string,
  ): Promise<IPastEclExp> {
    try {
      let personId!: number
      if (personType === 'student') {
        personId = (await this.usersService.findUserById(user_id)).person_id
      } else if (personType === 'spouse') {
        personId = (await this.spouseModel.findSpouseByUserId(user_id))
          .person_id
      }

      const createPastEclExpData: ICreatePastEclExp = {
        ...dto,
        past_exp_begin_date: new Date(dto.past_exp_begin_date),
        past_exp_end_date: dto.past_exp_end_date
          ? new Date(dto.past_exp_end_date)
          : null,
        person_id: personId,
        past_ecl_approved: null,
      }

      const newPastEclExp = await this.pastEclExpsModel.createPastEclExp(
        createPastEclExpData,
      )
      return newPastEclExp
    } catch (error) {
      throw error
    }
  }

  async findPastEclExpById(id: number): Promise<IPastEclExp | null> {
    try {
      const pastEclExp = await this.pastEclExpsModel.findPastEclExpById(id)
      return pastEclExp
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar a experiência eclesiástica com o ID ${id}: ${error.message}`,
      )
    }
  }

  async findPastEclExpsByPersonId(
    user_id: number,
    personType: string,
  ): Promise<IPastEclExp[] | null> {
    try {
      let personId!: number
      if (personType === 'student') {
        personId = (await this.usersService.findUserById(user_id)).person_id
      } else if (personType === 'spouse') {
        personId = (await this.spouseModel.findSpouseByUserId(user_id))
          .person_id
      }

      const pastEclExps = await this.pastEclExpsModel.findPastEclExpsByPersonId(
        personId,
      )
      return pastEclExps
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar experiências eclesiásticas para a pessoa com o ID fornecido: ${error.message}`,
      )
    }
  }

  async findAllPastEclExps(): Promise<IPastEclExp[]> {
    try {
      const allPastEclExps = await this.pastEclExpsModel.findAllPastEclExps()
      return allPastEclExps
    } catch (error) {
      throw error
    }
  }

  async updatePastEclExpById(dto: UpdatePastEclExpDto): Promise<IPastEclExp> {
    try {
      const updatePastEclExpData: IUpdatePastEclExp = {
        ...dto,
        past_exp_begin_date: new Date(dto.past_exp_begin_date),
        past_exp_end_date: dto.past_exp_end_date
          ? new Date(dto.past_exp_end_date)
          : null,
        past_ecl_approved: null,
      }

      const updatedPastEclExp =
        await this.pastEclExpsModel.updatePastEclExpById(updatePastEclExpData)
      return updatedPastEclExp
    } catch (error) {
      throw error
    }
  }

  async deletePastEclExpById(id: number): Promise<string> {
    try {
      await this.pastEclExpsModel.deletePastEclExpById(id)
      return 'Experiência eclesiástica deletada com sucesso.'
    } catch (error) {
      throw error
    }
  }
}