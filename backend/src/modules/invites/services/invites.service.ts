import { Injectable } from '@nestjs/common'
import { CreateInviteDto } from '../dto/create-invite.dto'
import {
  AcceptInviteDto,
  EvaluateInvite,
  UpdateInviteDto
} from '../dto/update-invite.dto'
import { InvitesModel } from '../model/invites.model'
import { IAcceptInvite, ICreateInvite, IEvaluateInvite } from '../types/types'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { VacanciesModel } from 'src/modules/vacancies/model/vacancies.model'
import { FieldRepresentationsModel } from 'src/modules/field-representations/model/field-representations.model'
import { VacanciesService } from 'src/modules/vacancies/services/vacancies.service'

@Injectable()
export class InvitesService {
  constructor(
    private readonly invitesModel: InvitesModel,
    private readonly vacaciesService: VacanciesService
  ) {}
  async validateNotOpenInvites(vacancyId: number, inviteId?: number) {
    try {
      const notOpenInvites = this.invitesModel.validateNotOpenInvites(
        vacancyId,
        inviteId
      )

      if (!notOpenInvites) {
        throw new Error('Vacancy has open invites')
      }
    } catch (error) {
      throw error
    }
  }
  async validateApprovedInvite(inviteId) {
    try {
      const approvedInvite = this.invitesModel.validateApprovedInvite(inviteId)
      if (!approvedInvite) {
        throw new Error('Invite not approved')
      }
    } catch (error) {
      throw error
    }
  }
  async createInvite(
    createInviteDto: CreateInviteDto,
    currentUser: UserFromJwt
  ) {
    try {
      //verifica se o usuário possui uma representação válida
      const activeRepresentation =
        await this.vacaciesService.findActiveRepresentation(currentUser.user_id)

      //verifica se o campo da vaga confere com o campo da representação
      await this.vacaciesService.validateSameFieldToVacancyAndRepresentations(
        activeRepresentation.representationID,
        null,
        createInviteDto.vacancyStudentId
      )

      //verifica se a vaga ainda não foi aceita por ninguém.
      await this.vacaciesService.validateNotAlredyAcceptedVacancy(
        createInviteDto.vacancyId
      )

      //verfica se o Estudante ainda não aceitou outro covite.
      await this.vacaciesService.validateNotAlreadyAcceptsToStudent(
        createInviteDto.studentId
      )

      // verifica se a vaga não possui algum outro convite em aberto
      await this.validateNotOpenInvites(createInviteDto.vacancyId)

      const deadline = new Date(createInviteDto.deadline)

      if (deadline <= new Date()) {
        throw new Error('date is equal or less than today')
      }

      const createInviteData: ICreateInvite = {
        accept: null,
        approved: null,
        deadline,
        vacancyStudentId: createInviteDto.vacancyStudentId
      }

      return await this.invitesModel.createInvite(createInviteData, currentUser)
    } catch (error) {
      console.error('erro capturado no createInvite no InvitesService:', error)
      throw error
    }
  }
  async evaluateInvite(
    evaluateInviteDto: EvaluateInvite,
    currentUser: UserFromJwt
  ) {
    try {
      //verifica se a vaga ainda não foi aceita por ninguém.
      await this.vacaciesService.validateNotAlredyAcceptedVacancy(
        evaluateInviteDto.vacancyId
      )

      //verifica se a vaga possui não possui convites em aberto
      await this.validateNotOpenInvites(evaluateInviteDto.vacancyId)

      //verfica se o Estudante ainda não aceitou outro convite.
      await this.vacaciesService.validateNotAlreadyAcceptsToStudent(
        evaluateInviteDto.studentId
      )

      const evaluateInviteData: IEvaluateInvite = {
        inviteId: evaluateInviteDto.inviteId,
        approved: evaluateInviteDto.approved
      }
      await this.invitesModel.evaluateInvite(evaluateInviteData)
    } catch (error) {
      console.error(
        'erro capturado no evaluateInvite no InvitesService:',
        error
      )
      throw error
    }
  }
  async acceptInvite(
    acceptInviteDto: AcceptInviteDto,
    currentUser: UserFromJwt
  ) {
    try {
      //verifica se a vaga ainda não foi aceita por ninguém.
      await this.vacaciesService.validateNotAlredyAcceptedVacancy(
        acceptInviteDto.vacancyId
      )

      //verfica se o Estudante ainda não aceitou outro covite.
      await this.vacaciesService.validateNotAlreadyAcceptsToStudent(
        acceptInviteDto.studentId
      )

      // verifica se o convite já foi aprovado
      await this.validateApprovedInvite(acceptInviteDto.inviteId)

      if (acceptInviteDto.accept) {
        await this.validateNotOpenInvites(
          acceptInviteDto.vacancyId,
          acceptInviteDto.inviteId
        )
      }

      const acceptInviteData: IAcceptInvite = {
        inviteId: acceptInviteDto.inviteId,
        accept: acceptInviteDto.accept
      }
      await this.invitesModel.acceptInvite(acceptInviteData)
    } catch (error) {
      console.error('erro capturado no acceptInvite no InvitesService:', error)
      throw error
    }
  }
  async deleteInvite(inviteId: number, currentUser: UserFromJwt) {
    try {
      const invite = await this.invitesModel.findInviteById(inviteId)

      const activeRepresentation =
        await this.vacaciesService.findActiveRepresentation(currentUser.user_id)

      await this.vacaciesService.validateSameFieldToVacancyAndRepresentations(
        activeRepresentation.representationID,
        invite.vacancyStudent.vacancyId,
        null
      )

      await this.vacaciesService.validateNotAnswersToStudentAndVacancy(
        invite.vacancyStudent.vacancyStudentId
      )

      await this.invitesModel.deleteInvite(inviteId, currentUser)
    } catch (error) {}
  }

  async findAllNotEvaluatedInvites() {
    try {
      const invites = await this.invitesModel.findAllNotEvaluatedInvites()
      return invites
    } catch (error) {
      console.error(
        'erro capturado no findAllNotEvaluatedInvites no InvitesService:',
        error
      )
      throw error
    }
  }

  async findAllRepInvites(repId: number) {
    try {
      const invites = await this.invitesModel.findAllRepInvites(repId)
      return invites
    } catch (error) {
      console.error(
        'erro capturado no findAllRepInvites no InvitesService:',
        error
      )
      throw error
    }
  }

  async findAllStudentInvites(studentId: number) {
    try {
      const invites = await this.invitesModel.findAllStudentInvites(studentId)
      return invites
    } catch (error) {
      console.error(
        'erro capturado no findiAllStudentInvites no InvitesService:',
        error
      )
      throw error
    }
  }
}