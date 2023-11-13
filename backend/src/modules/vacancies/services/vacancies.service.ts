import { Injectable } from '@nestjs/common'
import {
  CreateDirectVacancyDto,
  CreateVacancyDto
} from '../dto/create-vacancy.dto'
import { UpdateVacancyDto } from '../dto/update-vacancy.dto'
import {
  ICreateDirectVacancy,
  ICreateVacancy,
  IUpdateVacancy,
  IVacancy
} from '../types/types'
import { VacanciesModel } from '../model/vacancies.model'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { FieldRepsModel } from 'src/modules/field-reps/model/field-reps.model'
import { FieldRepresentationsModel } from 'src/modules/field-representations/model/field-representations.model'

@Injectable()
export class VacanciesService {
  constructor(
    private vacanciesModel: VacanciesModel,
    private fieldRepresentationsModel: FieldRepresentationsModel
  ) {}

  async createDirectVacancy(
    dto: CreateDirectVacancyDto,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      const createDirectVacancy: ICreateDirectVacancy = {
        ...dto,
        title: 'Vaga direta',
        accept: true,
        approved: true,
        deadline: new Date(),
        description: 'Vaga criada pelo time da Coordenação'
      }

      const newVacancy = await this.vacanciesModel.createDirectVacancy(
        createDirectVacancy,
        currentUser
      )
      return newVacancy
    } catch (error) {
      console.error(
        'erro capturado no createDirectVacancy no VacanciesService:',
        error
      )
      throw error
    }
  }

  async createVacancy(
    createVacancyDto: CreateVacancyDto,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      const fieldRepresentations =
        await this.fieldRepresentationsModel.findFieldRepresentationsByUserId(
          currentUser.user_id
        )

      if (!fieldRepresentations) {
        throw new Error('representations not found')
      }

      const activeFieldRepresentation = fieldRepresentations.find(
        (representaion) =>
          representaion.repActiveValidate <= new Date() &&
          representaion.repApproved
      )

      if (!activeFieldRepresentation) {
        throw new Error('active representation not found')
      }

      const createVacancyData: ICreateVacancy = {
        fieldId: activeFieldRepresentation.representedFieldID,
        description: createVacancyDto.description,
        title: createVacancyDto.title,
        hiringStatusId: createVacancyDto.hiringStatusId,
        nominataId: createVacancyDto.nominataId,
        repId: activeFieldRepresentation.rep.repId,
        ministryId: createVacancyDto.ministryId
      }

      const newVacancy = await this.vacanciesModel.createVacancy(
        createVacancyData
      )

      return true
    } catch (error) {
      console.error(
        'erro capturado no createDirectVacancy no VacanciesService:',
        error
      )
      throw error
    }
  }

  async udpateVacancyById(
    updateVacancyDto: UpdateVacancyDto,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      const fieldRepresentations =
        await this.fieldRepresentationsModel.findFieldRepresentationsByUserId(
          currentUser.user_id
        )

      if (!fieldRepresentations) {
        throw new Error('representations not found')
      }

      const activeFieldRepresentation = fieldRepresentations.find(
        (representaion) =>
          representaion.repActiveValidate <= new Date() &&
          representaion.repApproved
      )

      if (!activeFieldRepresentation) {
        throw new Error('active representation not found')
      }

      const nullAccptInviteVacancy =
        await this.vacanciesModel.findRepVacancyWhitNoAccepts(
          updateVacancyDto.vacancyId
        )

      if (!nullAccptInviteVacancy) {
        throw new Error('null accept invite vacancy not found')
      }

      const updateVacancyData: IUpdateVacancy = {
        description: updateVacancyDto.description,
        title: updateVacancyDto.title,
        hiringStatusId: updateVacancyDto.hiringStatusId,
        ministryId: updateVacancyDto.ministryId,
        vacancyId: updateVacancyDto.vacancyId
      }

      const updatedVacancy = await this.vacanciesModel.udpateVacancy(
        updateVacancyData
      )
    } catch (error) {
      console.error(
        'erro capturado no udpateVacancyById no VacanciesService:',
        error
      )
      throw error
    }
    return true
  }

  async deleteVacancyById(
    vacancyId: number,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      const fieldRepresentations =
        await this.fieldRepresentationsModel.findFieldRepresentationsByUserId(
          currentUser.user_id
        )

      if (!fieldRepresentations) {
        throw new Error('representations not found')
      }

      const activeFieldRepresentation = fieldRepresentations.find(
        (representaion) =>
          representaion.repActiveValidate <= new Date() &&
          representaion.repApproved
      )

      if (!activeFieldRepresentation) {
        throw new Error('active representation not found')
      }

      const nullAccptInviteVacancy =
        await this.vacanciesModel.findRepVacancyWhitNoAccepts(vacancyId)

      if (!nullAccptInviteVacancy) {
        throw new Error('null accept invite vacancy not found')
      }
      await this.vacanciesModel.deleteVacancy(vacancyId)
    } catch (error) {
      console.error(
        'erro capturado no deleteVacancyById no VacanciesService:',
        error
      )
      throw error
    }
    return true
  }

  async findRepVacanciesByNominataId(
    currentUser: UserFromJwt,
    nominataId: number
  ): Promise<IVacancy[]> {
    try {
      const fieldRepresentations =
        await this.fieldRepresentationsModel.findFieldRepresentationsByUserId(
          currentUser.user_id
        )

      if (!fieldRepresentations) {
        throw new Error('representations not found')
      }

      const activeFieldRepresentation = fieldRepresentations.find(
        (representaion) =>
          representaion.repActiveValidate <= new Date() &&
          representaion.repApproved
      )

      if (!activeFieldRepresentation) {
        throw new Error('active representation not found')
      }

      const vacancies = await this.vacanciesModel.findRepVacanciesByNominataId({
        nominataId: nominataId,
        repId: activeFieldRepresentation.rep.repId
      })
      return vacancies
    } catch (error) {
      console.error(
        'erro capturado no findRepVacanciesByNominataId no VacanciesService:',
        error
      )
      throw error
    }
  }
}
