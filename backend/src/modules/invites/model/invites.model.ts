import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'

import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { IBasicStudent } from 'src/modules/nominatas/types/types'
import {
  IAcceptInvite,
  ICreateInvite,
  IEvaluateInvite,
  ICompleteInvite,
  IInvite
} from '../types/types'
import {
  ICompleteVacancy,
  ICompleteVacancyStudent
} from 'src/modules/vacancies/types/types'

@Injectable()
export class InvitesModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async createInvite(
    createInviteData: ICreateInvite,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      const { vacancyStudentId, accept, approved, deadline } = createInviteData

      const [invite_id] = await this.knex('invites').insert({
        vacancy_student_id: vacancyStudentId,
        accept,
        approved,
        deadline
      })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Convite já existe')
      } else {
        throw new Error(error)
      }
    }

    return true
  }

  async deleteInvite(
    inviteId: number,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    try {
      await this.knex('invites')
        .del()
        .where('invite_id', inviteId)
        .returning('invite_id')
    } catch (error) {
      console.error('erro capturado no deleteInvite no InvitesModel:', error)
      throw error
    }

    return true
  }

  async evaluateInvite(evaluateIviteData: IEvaluateInvite): Promise<boolean> {
    try {
      const { approved, inviteId } = evaluateIviteData

      await this.knex('invites')
        .update({
          approved
        })
        .where('invite_id', inviteId)
        .returning('invite')
    } catch (error) {
      console.error('erro capturado no evaluateInvite no InvitesModel:', error)

      throw error
    }

    return true
  }

  async acceptInvite(evaluateIviteData: IAcceptInvite): Promise<boolean> {
    try {
      const { accept, inviteId } = evaluateIviteData

      await this.knex('vacancies')
        .update({
          accept
        })
        .where('invite_id', inviteId)
        .andWhere('accept', null)
        .returning('invite')
    } catch (error) {
      console.error('erro capturado no evaluateInvite no InvitesModel:', error)

      throw error
    }

    return true
  }

  async findAllNotEvaluatedInvites(): Promise<ICompleteInvite[]> {
    try {
      const invitesConsult = await this.knex('invites')
        .leftJoin(
          'vacancies_students',
          'invites.vacancy_student_id',
          'vacancies_students.vacancy_student_id'
        )
        .leftJoin(
          'vacancies',
          'vacancies_students.vacancy_id',
          'vacancies.vacancy_id'
        )
        .leftJoin('field_reps', 'vacancies.rep_id', 'field_reps.rep_id')
        .leftJoin(
          'people as repPeople',
          'field_reps.person_id',
          'repPeople.person_id'
        )
        .leftJoin(
          'ministries',
          'vacancies.ministry_id',
          'ministries.ministry_id'
        )
        .leftJoin(
          'hiring_status as vacHiring_status',
          'vacancies.hiring_status_id',
          'hiring_status.hiring_status_id'
        )
        .leftJoin(
          'associations as vacAssociations',
          'vacancies.field_id',
          'vacAssociations.association_id'
        )
        .leftJoin(
          'unions as vacUnions',
          'vacUnions.union_id',
          'associations.union_id'
        )
        .leftJoin('nominatas', 'vacancies.nominata_id', 'nominatas.nominata_id')
        .leftJoin(
          'students',
          'vacancies_students.student_id',
          'students.student_id'
        )
        .leftJoin(
          'people as stdPeople',
          'students.person_id',
          'stdPeople.person_id'
        )
        .leftJoin(
          'associations as stAssociations',
          'students.origin_field_id',
          'stAssociations.association_id'
        )
        .leftJoin(
          'unions as stUnions',
          'stUnions.union_id',
          'stAssociations.union_id'
        )
        .leftJoin(
          'hiring_status as stHiring_status',
          'students.hiring_status_id',
          'hiring_status.hiring_status_id'
        )
        .select(
          'field_reps.rep_id',
          'field_reps.person_id',
          'repPeople.name as repName',
          'repPeople.phone_number',
          'vacancies.vacancy_id',
          'vacancies.title',
          'vacancies.description',
          'vacancies.field_id',
          'vacancies.rep_id',
          'vacancies.ministry_id',
          'vacancies.hiring_status_id',
          'vacancies.nominata_id',
          'ministries.ministry_type_name',
          'vacHiring_status.hiring_status_name as vacHiring_status_name',
          'vacAssociations.association_name as vacAssociation_name',
          'vacAssociations.association_acronym as vacAssociation_acronym',
          'vacUnions.union_name as vacUnion_name',
          'vacUnions.union_acronym as vacUnion_acronym',
          'vacancies_students.student_id',
          'nominatas.year',
          'nominatas.orig_field_invites_begin',
          'stdPeople.name as stdName',
          'stdPeople.person_id as stdPerson_id',
          'stAssociations.association_acronym as stAssociation_acronym',
          'stUnions.union_acronym as stUnion_acronym',
          'stHiring_status.hiring_status_name as stHiring_status_name',
          'students.student_id',
          'vacancies_students.vacancy_student_id',
          'vacancies_students.student_id',
          'vacancies_students.vacancy_id',
          'vacancies_students.comments',
          'invites.accept',
          'invites.deadline',
          'invites.ivite_id',
          'invites.approved'
        )
        .where('invites.approved', null)

      const invites: ICompleteInvite[] = invitesConsult.map((row) => {
        const rep = {
          repId: row.rep_id,
          personId: row.person_id,
          personName: row.repName,
          phoneNumber: row.phone_number
        }

        const vacancy: ICompleteVacancy = {
          vacancyId: row.vacancy_id,
          title: row.title,
          description: row.description,
          fieldId: row.field_id,
          repId: row.rep_id,
          ministryId: row.ministry_id,
          hiringStatusId: row.hiring_status_id,
          nominataId: row.nominata_id,

          ministry: row.ministry,
          hiring_status: row.vacHiring_status,
          associationName: row.vacAssociation_name,
          unionName: row.vacUnion_name,
          associationAcronym: row.vacAssociation_acronym,
          unionAcronym: row.vacUnion_acronym,
          nominataYear: row.year,
          originFieldInvitesBegins: row.origin_field_invites_begins,
          rep
        }

        const student: IBasicStudent = {
          association_acronym: row.stAssociation_acronym,
          hiring_status_name: row.stHiring_status_name,
          name: row.stdName,
          person_id: row.stdPerson_id,
          small_alone_photo: '',
          student_id: row.student_id,
          union_acronym: row.stUnion_acronym,
          user_id: 0
        }

        const vacancyStudent: ICompleteVacancyStudent = {
          vacancyStudentId: row.vacancy_student_id,
          studentId: row.student_id,
          student,
          vacancyId: row.vacancy_id,
          comments: row.comments,
          vacancy
        }

        const invite: ICompleteInvite = {
          accept: row.accept,
          deadline: row.deadline,
          inviteId: row.invite_id,
          approved: row.approved,
          vacancyStudent
        }

        return invite
      })

      return invites
    } catch (error) {
      console.error(
        'erro capturado no findAllNotEvaluatedInvites no InvitesModel:',
        error
      )

      throw error
    }
  }

  async findAllStudentInvites(studentId: number): Promise<ICompleteInvite[]> {
    try {
      const invitesConsult = await this.knex('invites')
        .leftJoin(
          'vacancies_students',
          'invites.vacancy_student_id',
          'vacancies_students.vacancy_student_id'
        )
        .leftJoin(
          'vacancies',
          'vacancies_students.vacancy_id',
          'vacancies.vacancy_id'
        )
        .leftJoin('field_reps', 'vacancies.rep_id', 'field_reps.rep_id')
        .leftJoin(
          'people as repPeople',
          'field_reps.person_id',
          'repPeople.person_id'
        )
        .leftJoin(
          'ministries',
          'vacancies.ministry_id',
          'ministries.ministry_id'
        )
        .leftJoin(
          'hiring_status as vacHiring_status',
          'vacancies.hiring_status_id',
          'hiring_status.hiring_status_id'
        )
        .leftJoin(
          'associations as vacAssociations',
          'vacancies.field_id',
          'vacAssociations.association_id'
        )
        .leftJoin(
          'unions as vacUnions',
          'vacUnions.union_id',
          'associations.union_id'
        )
        .leftJoin('nominatas', 'vacancies.nominata_id', 'nominatas.nominata_id')
        .leftJoin(
          'students',
          'vacancies_students.student_id',
          'students.student_id'
        )
        .leftJoin(
          'people as stdPeople',
          'students.person_id',
          'stdPeople.person_id'
        )
        .leftJoin(
          'associations as stAssociations',
          'students.origin_field_id',
          'stAssociations.association_id'
        )
        .leftJoin(
          'unions as stUnions',
          'stUnions.union_id',
          'stAssociations.union_id'
        )
        .leftJoin(
          'hiring_status as stHiring_status',
          'students.hiring_status_id',
          'hiring_status.hiring_status_id'
        )
        .select(
          'field_reps.rep_id',
          'field_reps.person_id',
          'repPeople.name as repName',
          'repPeople.phone_number',
          'vacancies.vacancy_id',
          'vacancies.title',
          'vacancies.description',
          'vacancies.field_id',
          'vacancies.rep_id',
          'vacancies.ministry_id',
          'vacancies.hiring_status_id',
          'vacancies.nominata_id',
          'ministries.ministry_type_name',
          'vacHiring_status.hiring_status_name as vacHiring_status_name',
          'vacAssociations.association_name as vacAssociation_name',
          'vacAssociations.association_acronym as vacAssociation_acronym',
          'vacUnions.union_name as vacUnion_name',
          'vacUnions.union_acronym as vacUnion_acronym',
          'vacancies_students.student_id',
          'nominatas.year',
          'nominatas.orig_field_invites_begin',
          'stdPeople.name as stdName',
          'stdPeople.person_id as stdPerson_id',
          'stAssociations.association_acronym as stAssociation_acronym',
          'stUnions.union_acronym as stUnion_acronym',
          'stHiring_status.hiring_status_name as stHiring_status_name',
          'students.student_id',
          'vacancies_students.vacancy_student_id',
          'vacancies_students.student_id',
          'vacancies_students.vacancy_id',
          'vacancies_students.comments',
          'invites.accept',
          'invites.deadline',
          'invites.ivite_id',
          'invites.approved'
        )
        .where('vacancies_students.student_id', studentId)

      const invites: ICompleteInvite[] = invitesConsult.map((row) => {
        const rep = {
          repId: row.rep_id,
          personId: row.person_id,
          personName: row.repName,
          phoneNumber: row.phone_number
        }

        const vacancy: ICompleteVacancy = {
          vacancyId: row.vacancy_id,
          title: row.title,
          description: row.description,
          fieldId: row.field_id,
          repId: row.rep_id,
          ministryId: row.ministry_id,
          hiringStatusId: row.hiring_status_id,
          nominataId: row.nominata_id,

          ministry: row.ministry,
          hiring_status: row.vacHiring_status,
          associationName: row.vacAssociation_name,
          unionName: row.vacUnion_name,
          associationAcronym: row.vacAssociation_acronym,
          unionAcronym: row.vacUnion_acronym,
          nominataYear: row.year,
          originFieldInvitesBegins: row.origin_field_invites_begins,
          rep
        }

        const student: IBasicStudent = {
          association_acronym: row.stAssociation_acronym,
          hiring_status_name: row.stHiring_status_name,
          name: row.stdName,
          person_id: row.stdPerson_id,
          small_alone_photo: '',
          student_id: row.student_id,
          union_acronym: row.stUnion_acronym,
          user_id: 0
        }

        const vacancyStudent: ICompleteVacancyStudent = {
          vacancyStudentId: row.vacancy_student_id,
          studentId: row.student_id,
          student,
          vacancyId: row.vacancy_id,
          comments: row.comments,
          vacancy
        }

        const invite: ICompleteInvite = {
          accept: row.accept,
          deadline: row.deadline,
          inviteId: row.invite_id,
          approved: row.approved,
          vacancyStudent
        }

        return invite
      })

      return invites
    } catch (error) {
      console.error(
        'erro capturado no findAllNotEvaluatedInvites no InvitesModel:',
        error
      )

      throw error
    }
  }

  async findInviteById(inviteId: number): Promise<IInvite> {
    try {
      const inviteConsult = await this.knex('invites')
        .leftJoin(
          'vacancies_students',
          'invites.vacancy_student_id',
          'vacancies_students.vacancy_student_id'
        )
        .first('*')
        .where('invite_id', inviteId)

      const invite: IInvite = {
        accept: inviteConsult.accept,
        approved: inviteConsult.approved,
        deadline: inviteConsult.deadline,
        inviteId: inviteConsult.invite_id,
        vacancyStudent: {
          comments: inviteConsult.comments,
          vacancyId: inviteConsult.vacancy_id,
          vacancyStudentId: inviteConsult.vacancy_student_id,
          studentId: inviteConsult.student_id
        }
      }

      return invite
    } catch (error) {
      console.error('erro capturado no findInviteById no InvitesModel:', error)
      throw error
    }
  }

  async findAllRepInvites(repId: number): Promise<ICompleteInvite[]> {
    try {
      const invitesConsult = await this.knex('invites')
        .leftJoin(
          'vacancies_students',
          'invites.vacancy_student_id',
          'vacancies_students.vacancy_student_id'
        )
        .leftJoin(
          'vacancies',
          'vacancies_students.vacancy_id',
          'vacancies.vacancy_id'
        )
        .leftJoin('field_reps', 'vacancies.rep_id', 'field_reps.rep_id')
        .leftJoin(
          'people as repPeople',
          'field_reps.person_id',
          'repPeople.person_id'
        )
        .leftJoin(
          'ministries',
          'vacancies.ministry_id',
          'ministries.ministry_id'
        )
        .leftJoin(
          'hiring_status as vacHiring_status',
          'vacancies.hiring_status_id',
          'hiring_status.hiring_status_id'
        )
        .leftJoin(
          'associations as vacAssociations',
          'vacancies.field_id',
          'vacAssociations.association_id'
        )
        .leftJoin(
          'unions as vacUnions',
          'vacUnions.union_id',
          'associations.union_id'
        )
        .leftJoin('nominatas', 'vacancies.nominata_id', 'nominatas.nominata_id')
        .leftJoin(
          'students',
          'vacancies_students.student_id',
          'students.student_id'
        )
        .leftJoin(
          'people as stdPeople',
          'students.person_id',
          'stdPeople.person_id'
        )
        .leftJoin(
          'associations as stAssociations',
          'students.origin_field_id',
          'stAssociations.association_id'
        )
        .leftJoin(
          'unions as stUnions',
          'stUnions.union_id',
          'stAssociations.union_id'
        )
        .leftJoin(
          'hiring_status as stHiring_status',
          'students.hiring_status_id',
          'hiring_status.hiring_status_id'
        )
        .select(
          'field_reps.rep_id',
          'field_reps.person_id',
          'repPeople.name as repName',
          'repPeople.phone_number',
          'vacancies.vacancy_id',
          'vacancies.title',
          'vacancies.description',
          'vacancies.field_id',
          'vacancies.rep_id',
          'vacancies.ministry_id',
          'vacancies.hiring_status_id',
          'vacancies.nominata_id',
          'ministries.ministry_type_name',
          'vacHiring_status.hiring_status_name as vacHiring_status_name',
          'vacAssociations.association_name as vacAssociation_name',
          'vacAssociations.association_acronym as vacAssociation_acronym',
          'vacUnions.union_name as vacUnion_name',
          'vacUnions.union_acronym as vacUnion_acronym',
          'vacancies_students.student_id',
          'nominatas.year',
          'nominatas.orig_field_invites_begin',
          'stdPeople.name as stdName',
          'stdPeople.person_id as stdPerson_id',
          'stAssociations.association_acronym as stAssociation_acronym',
          'stUnions.union_acronym as stUnion_acronym',
          'stHiring_status.hiring_status_name as stHiring_status_name',
          'students.student_id',
          'vacancies_students.vacancy_student_id',
          'vacancies_students.student_id',
          'vacancies_students.vacancy_id',
          'vacancies_students.comments',
          'invites.accept',
          'invites.deadline',
          'invites.ivite_id',
          'invites.approved'
        )
        .where('vacancies.rep_id', repId)

      const invites: ICompleteInvite[] = invitesConsult.map((row) => {
        const rep = {
          repId: row.rep_id,
          personId: row.person_id,
          personName: row.repName,
          phoneNumber: row.phone_number
        }

        const vacancy: ICompleteVacancy = {
          vacancyId: row.vacancy_id,
          title: row.title,
          description: row.description,
          fieldId: row.field_id,
          repId: row.rep_id,
          ministryId: row.ministry_id,
          hiringStatusId: row.hiring_status_id,
          nominataId: row.nominata_id,

          ministry: row.ministry,
          hiring_status: row.vacHiring_status,
          associationName: row.vacAssociation_name,
          unionName: row.vacUnion_name,
          associationAcronym: row.vacAssociation_acronym,
          unionAcronym: row.vacUnion_acronym,
          nominataYear: row.year,
          originFieldInvitesBegins: row.origin_field_invites_begins,
          rep
        }

        const student: IBasicStudent = {
          association_acronym: row.stAssociation_acronym,
          hiring_status_name: row.stHiring_status_name,
          name: row.stdName,
          person_id: row.stdPerson_id,
          small_alone_photo: '',
          student_id: row.student_id,
          union_acronym: row.stUnion_acronym,
          user_id: 0
        }

        const vacancyStudent: ICompleteVacancyStudent = {
          vacancyStudentId: row.vacancy_student_id,
          studentId: row.student_id,
          student,
          vacancyId: row.vacancy_id,
          comments: row.comments,
          vacancy
        }

        const invite: ICompleteInvite = {
          accept: row.accept,
          deadline: row.deadline,
          inviteId: row.invite_id,
          approved: row.approved,
          vacancyStudent
        }

        return invite
      })

      return invites
    } catch (error) {
      console.error(
        'erro capturado no findAllRepInvites no InvitesModel:',
        error
      )

      throw error
    }
  }

  async validateNotOpenInvites(vacancyId: number, inviteId: number = 0) {
    try {
      const invites = await this.knex('vacancies')
        .join(
          'vacancies_students',
          'vacancies.vacancy_id',
          'vacancies_students.vacancy_id'
        )
        .leftJoin(
          'invites',
          'invites.vacancy_student_id',
          'vacancies_students.vacancy_student_id'
        )
        .select('invites.invite_id')
        .where('vacancies.vacancy_id', vacancyId)
        .andWhere({ 'invites.accept': null })
        .andWhereNot({
          'invites.invite_id': inviteId,
          'invites.approved': false
        })

      if (invites.length > 0) {
        return false
      } else {
        return true
      }
    } catch (error) {
      console.error(
        'erro capturado no validateNotOpenInvites no InvitesModel:',
        error
      )
      throw error
    }
  }

  async validateApprovedInvite(inviteId: number) {
    try {
      const inviteconsult = await this.knex('invites')
        .where({ invite_id: inviteId })
        .andWhere({ approved: true })
        .first('invite_id')

      if (inviteconsult) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error(
        'erro capturado no validateApprovedInvite no InvitesModel:',
        error
      )
      throw error
    }
  }
}
