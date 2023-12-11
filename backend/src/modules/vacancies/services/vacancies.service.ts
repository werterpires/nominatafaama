import { Injectable } from '@nestjs/common'
import {
  CreateDirectVacancyDto,
  CreateVacancyDto
} from '../dto/create-vacancy.dto'
import { UpdateVacancyDto } from '../dto/update-vacancy.dto'
import {
  IAddStudentToVacancy,
  ICreateDirectVacancy,
  ICreateVacancy,
  IUpdateVacancy,
  IUpdateVacancyStudent,
  IVacancy,
  IMediumVacancyStudent
} from '../types/types'
import { VacanciesModel } from '../model/vacancies.model'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { FieldRepresentationsModel } from 'src/modules/field-representations/model/field-representations.model'
import { CreateVacancyStudentDto } from '../dto/create-vacancy-student.dto'
import { UpdateVacancyStudentDto } from '../dto/update-vacancy-student.dto'
import { IBasicStudent } from 'src/modules/nominatas/types/types'
import { IFieldRepresentation } from 'src/modules/field-representations/types/types'

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

  async findActiveRepresentation(
    userId: number
  ): Promise<IFieldRepresentation> {
    try {
      const fieldRepresentations =
        await this.fieldRepresentationsModel.findFieldRepresentationsByUserId(
          userId
        )

      if (fieldRepresentations.length === 0) {
        throw new Error('representations not found')
      }

      const activeFieldRepresentation = fieldRepresentations.find(
        (representaion) =>
          new Date(representaion.repActiveValidate) >= new Date() &&
          representaion.repApproved
      )

      if (!activeFieldRepresentation) {
        throw new Error('active representation not found')
      }

      return activeFieldRepresentation
    } catch (error) {
      throw error
    }
  }

  async validateNotAlredyAcceptedVacancy(vacancyId: number): Promise<void> {
    try {
      const vacancyNotAlreadyAccpetted =
        await this.vacanciesModel.validateNotAcceptsToVacancy(vacancyId)

      if (!vacancyNotAlreadyAccpetted) {
        throw new Error('vacancy already accepted')
      }
    } catch (error) {
      throw error
    }
  }

  async validateNotAlreadyAcceptsToStudent(studentId: number) {
    try {
      const studentNotAlreadyAccpetted =
        await this.vacanciesModel.validateNotAcceptsToStudent(studentId)

      if (!studentNotAlreadyAccpetted) {
        throw new Error('student already accepted a vacancy')
      }
    } catch (error) {
      throw error
    }
  }

  async validateNotApprovedInvitesToVacancy(vacancyId: number) {
    try {
      const vacancyNotAswered =
        await this.vacanciesModel.validateNotApprovedInvitesToVacancy(vacancyId)

      if (!vacancyNotAswered) {
        throw new Error('vacancy already approved')
      }
    } catch (error) {
      throw error
    }
  }

  async findVacancyHiringStatus(vacancyId: number): Promise<number> {
    try {
      const hiringStatusId = await this.vacanciesModel.findVacancyHiringStatus(
        vacancyId
      )
      return hiringStatusId
    } catch (error) {
      throw error
    }
  }

  async validateNotAnswersToStudentAndVacancy(vacancyStudentId: number) {
    try {
      const notInviteAnswered =
        await this.vacanciesModel.validateNotAcceptsToStudentAndToVacancy(
          vacancyStudentId
        )

      if (!notInviteAnswered) {
        throw new Error('student already answered a invite to this vacancy')
      }
    } catch (error) {
      throw error
    }
  }

  async validateSameFieldToVacancyAndRepresentations(
    representationId: number,
    vacancyId: number | null,
    vacancyStudentId: number | null
  ) {
    try {
      let validateData: {
        representationId: number
        vacancyId?: number
        vacancyStudentId?: number
      }
      if (vacancyId) {
        validateData = { representationId, vacancyId }
      } else if (vacancyStudentId) {
        validateData = { representationId, vacancyStudentId }
      } else {
        throw new Error('data to validateData not found')
      }

      const thereIsCorrespondense =
        await this.vacanciesModel.validateSameFieldToVacancyAndRepresentations(
          validateData
        )

      if (!thereIsCorrespondense) {
        throw new Error(
          'there is no correspondense between vacancy and representation'
        )
      }
    } catch (error) {
      throw error
    }
  }
  async createVacancy(
    createVacancyDto: CreateVacancyDto,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      //verifica se o usuário atual possui representações e se possui pele menos uma representação válida
      const activeFieldRepresentation = await this.findActiveRepresentation(
        currentUser.user_id
      )

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
  async addStudentToVacancy(
    createvacancyStudentDto: CreateVacancyStudentDto,
    currentUser: UserFromJwt
  ): Promise<IMediumVacancyStudent> {
    try {
      //verifica se o usuário atual possui representações e se possui pele menos uma representação válida
      const activeFieldRepresentation = await this.findActiveRepresentation(
        currentUser.user_id
      )

      //Verifica se a vaga corresponde à representação ativa
      await this.validateSameFieldToVacancyAndRepresentations(
        activeFieldRepresentation.representationID,
        createvacancyStudentDto.vacancyId,
        null
      )

      //verifica se a vaga seleccionada já não possui um aceite por parte de outro estudante.
      await this.validateNotAlredyAcceptedVacancy(
        createvacancyStudentDto.vacancyId
      )

      //verifica se o estudante não aceitou alguma vaga
      await this.validateNotAlreadyAcceptsToStudent(
        createvacancyStudentDto.studentId
      )

      const createVacancyStudentData: IAddStudentToVacancy = {
        comments: createvacancyStudentDto.comments,
        studentId: createvacancyStudentDto.studentId,
        vacancyId: createvacancyStudentDto.vacancyId
      }

      const newVacancyStudent = await this.vacanciesModel.addStudentToVacancy(
        createVacancyStudentData
      )

      return newVacancyStudent
    } catch (error) {
      console.error(
        'erro capturado no addStudentToVacancy no VacanciesService:',
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
      //verifica se o usuário atual possui representações e se possui pele menos uma representação válida
      const activeFieldRepresentation = await this.findActiveRepresentation(
        currentUser.user_id
      )

      //Verifica se a vaga corresponde à representação ativa
      await this.validateSameFieldToVacancyAndRepresentations(
        activeFieldRepresentation.representationID,
        updateVacancyDto.vacancyId,
        null
      )

      //verifica se a vaga não possui nenhum pedido aprovado.
      await this.validateNotApprovedInvitesToVacancy(updateVacancyDto.vacancyId)

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
  async udpateVacancyStudentById(
    updateVacancyStudentDto: UpdateVacancyStudentDto,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      //verifica se o usuário atual possui representações e se possui pele menos uma representação válida
      const activeFieldRepresentation = await this.findActiveRepresentation(
        currentUser.user_id
      )
      //Verifica se a vaga corresponde à representação ativa
      await this.validateSameFieldToVacancyAndRepresentations(
        activeFieldRepresentation.representationID,
        null,
        updateVacancyStudentDto.vacancyStudentId
      )

      const updateVacancyStudentData: IUpdateVacancyStudent = {
        comments: updateVacancyStudentDto.comments,
        vacancyStudentId: updateVacancyStudentDto.vacancyStudentId
      }

      const updatedVacancyStudent =
        await this.vacanciesModel.udpateStudentInVacancy(
          updateVacancyStudentData
        )
    } catch (error) {
      console.error(
        'erro capturado no udpateVacancyStudentById no VacanciesService:',
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
      //verifica se o usuário atual possui representações e se possui pele menos uma representação válida
      const activeFieldRepresentation = await this.findActiveRepresentation(
        currentUser.user_id
      )

      //Verifica se a vaga corresponde à representação ativa
      await this.validateSameFieldToVacancyAndRepresentations(
        activeFieldRepresentation.representationID,
        vacancyId,
        null
      )
      //verifica se a vaga não possui nenhum pedido aprovado.
      await this.validateNotApprovedInvitesToVacancy(vacancyId)

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

  async removeStudentFromVacancy(
    vacancyStudentId: number,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      //verifica se o usuário atual possui representações e se possui pele menos uma representação válida
      const activeFieldRepresentation = await this.findActiveRepresentation(
        currentUser.user_id
      )

      //Verifica se a vaga corresponde à representação ativa
      await this.validateSameFieldToVacancyAndRepresentations(
        activeFieldRepresentation.representationID,
        null,
        vacancyStudentId
      )

      //verifica se essa vaga já não foi respondida por esse estudante
      await this.validateNotAnswersToStudentAndVacancy(vacancyStudentId)

      await this.vacanciesModel.removeStudentFromVacancy(vacancyStudentId)
    } catch (error) {
      console.error(
        'erro capturado no removeStudentFromVacancy no VacanciesService:',
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
      //verifica se o usuário atual possui representações e se possui pele menos uma representação válida
      const activeFieldRepresentation = await this.findActiveRepresentation(
        currentUser.user_id
      )

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

  async findAllStudentsWithNoAcceptsByNominataId(
    currentUser: UserFromJwt,
    nominataId: number
  ): Promise<IBasicStudent[]> {
    try {
      //verifica se o usuário atual possui representações e se possui pele menos uma representação válida
      const activeFieldRepresentation = await this.findActiveRepresentation(
        currentUser.user_id
      )

      const students = await this.vacanciesModel.findAllStudentsWithNoAccepts(
        nominataId
      )
      return students
    } catch (error) {
      console.error(
        'erro capturado no findRepVacanciesByNominataId no VacanciesService:',
        error
      )
      throw error
    }
  }
}
