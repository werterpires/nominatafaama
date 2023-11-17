import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  IAddStudentToVacancy,
  ICreateDirectVacancy,
  ICreateVacancy,
  IInvite,
  IUpdateVacancy,
  IUpdateVacancyStudent,
  IVacancy,
  IVacancyStudent
} from '../types/types'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { IBasicStudent } from 'src/modules/nominatas/types/types'

@Injectable()
export class VacanciesModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async createDirectVacancy(
    createDirectVacancy: ICreateDirectVacancy,
    currentUser: UserFromJwt
  ): Promise<boolean> {
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const {
          title,
          description,
          field_id,
          student_id,
          accept,
          approved,
          deadline,
          hiring_status_id
        } = createDirectVacancy

        let vacancy_id: number | null = null

        const acceptedInviteWhithoutRepId = await trx('vacancies')
          .first('*')
          .leftJoin(
            'vacancies_students',
            'vacancies.vacancy_id',
            'vacancies_students.vacancy_id'
          )
          .leftJoin(
            'invites',
            'vacancies_students.vacancy_student_id',
            'invites.vacancy_student_id'
          )
          .where('vacancies_students.student_id', student_id)
          .andWhere('vacancies.rep_id', null)
          .andWhere('invites.accept', true)

        if (acceptedInviteWhithoutRepId) {
          await trx('vacancies')
            .update({
              field_id
            })
            .where('vacancy_id', acceptedInviteWhithoutRepId.vacancy_id)
            .returning('vacancy_id')

          if (acceptedInviteWhithoutRepId.invite_id) {
            await trx('invites')
              .update({
                accept,
                approved,
                deadline
              })
              .where('invite_id', acceptedInviteWhithoutRepId.invite_id)
          }
        } else {
          ;[vacancy_id] = await trx('vacancies')
            .insert({
              title,
              description,
              field_id
            })
            .returning('vacancy_id')

          const [vacancy_student_id] = await trx('vacancies_students')
            .insert({ vacancy_id, student_id })
            .returning('vacancy_student_id')

          const [invite_id] = await trx('invites').insert({
            vacancy_student_id,
            accept,
            approved,
            deadline
          })
        }

        await trx('students')
          .update({
            hiring_status_id
          })
          .where('student_id', student_id)

        await trx.commit()

        const realVacancyId = vacancy_id
          ? vacancy_id
          : acceptedInviteWhithoutRepId.vacancy_id

        const personAndOthers = await this.knex('vacancies')
          .leftJoin(
            'vacancies_students',
            'vacancies_students.vacancy_id',
            'vacancies.vacancy_id'
          )
          .leftJoin(
            'students',
            'students.student_id',
            'vacancies_students.student_id'
          )
          .leftJoin(
            'hiring_status',
            'students.hiring_status_id',
            'hiring_status.hiring_status_id'
          )
          .leftJoin(
            'associations',
            'associations.association_id',
            'vacancies.field_id'
          )
          .leftJoin('users', 'students.person_id', 'users.person_id')
          .first(
            'hiring_status_name',
            'associations.association_name',
            'users.user_id'
          )
          .where('vacancies.vacancy_id', realVacancyId)

        await this.notificationsService.createNotification({
          action: 'editou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: {
            titulo: title,
            descricao: description,
            campo: personAndOthers.association_name,
            situacao: personAndOthers.hiring_status_name
          },
          notificationType: 6,
          objectUserId: personAndOthers.user_id,
          oldData: null,
          table: 'vagas'
        })
      } catch (error) {
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Vaga já existe')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      console.error(
        'Erro capturado na createDirectVacancy na VacanciesModel:',
        sentError
      )
      throw sentError
    }

    return true
  }
  async createVacancy(createVacancyData: ICreateVacancy): Promise<boolean> {
    try {
      const {
        title,
        description,
        fieldId,
        hiringStatusId,
        repId,
        ministryId,
        nominataId
      } = createVacancyData

      const [vacancy_id] = await this.knex('vacancies')
        .insert({
          title,
          description,
          field_id: fieldId,
          rep_id: repId,
          ministry_id: ministryId,
          hiring_status_id: hiringStatusId,
          nominata_id: nominataId
        })
        .returning('vacancy_id')
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Vaga já existe')
      } else {
        throw new Error(error.sqlMessage)
      }
    }

    return true
  }

  async addStudentToVacancy(
    addStudentToVacancyData: IAddStudentToVacancy
  ): Promise<boolean> {
    try {
      const { comments, studentId, vacancyId } = addStudentToVacancyData

      const [vacancy_id] = await this.knex('vacancies_students')
        .insert({
          comments,
          student_id: studentId,
          vacancy_id: vacancyId
        })
        .returning('vacancy_id')
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Estudante já está na vaga.')
      } else {
        throw new Error(error.sqlMessage)
      }
    }

    return true
  }
  async udpateVacancy(updateVacancyData: IUpdateVacancy): Promise<boolean> {
    try {
      const { title, description, hiringStatusId, ministryId, vacancyId } =
        updateVacancyData

      await this.knex('vacancies')
        .update({
          title,
          description,
          ministry_id: ministryId,
          hiring_status_id: hiringStatusId
        })
        .where('vacancy_id', vacancyId)
        .returning('vacancy_id')
    } catch (error) {
      console.error('erro capturado no updateVacancy no VacanciesModel:', error)
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Vaga já existe')
      } else {
        throw error
      }
    }

    return true
  }

  async udpateStudentInVacancy(
    updateStudentInVacancyData: IUpdateVacancyStudent
  ): Promise<boolean> {
    try {
      const { comments, vacancyStudentId } = updateStudentInVacancyData

      await this.knex('vacancies')
        .update({
          comments
        })
        .where('vacancy_student_id', vacancyStudentId)
        .returning('vacancy_id')
    } catch (error) {
      console.error(
        'erro capturado no udpateStudentInVacancy no VacanciesModel:',
        error
      )
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Vaga já existe')
      } else {
        throw error
      }
    }

    return true
  }
  async deleteVacancy(vacancyId: number): Promise<boolean> {
    try {
      await this.knex('vacancies')
        .del()
        .where('vacancy_id', vacancyId)
        .returning('vacancy_id')
    } catch (error) {
      console.error('erro capturado no deleteVacancy no VacanciesModel:', error)
      throw new Error(error.sqlMessage)
    }

    return true
  }

  async removeStudentFromVacancy(vacancyStudentId: number): Promise<boolean> {
    try {
      await this.knex('vacancies_students')
        .del()
        .where('vacancy_student_id', vacancyStudentId)
        .returning('vacancy_student_id')
    } catch (error) {
      console.error(
        'erro capturado no removeStudentFromVacancy no VacanciesModel:',
        error
      )
      throw new Error(error.sqlMessage)
    }

    return true
  }

  async findRepVacanciesByNominataId(findVacanciesData: {
    nominataId: number
    repId: number
  }): Promise<IVacancy[]> {
    try {
      const vacanciesConsult = await this.knex('vacancies')
        .leftJoin(
          'ministry_types',
          'vacancies.ministry_id',
          'ministry_types.ministry_type_id'
        )
        .leftJoin(
          'hiring_status',
          'vacancies.hiring_status_id',
          'hiring_status.hiring_status_id'
        )
        .leftJoin(
          'associations',
          'vacancies.field_id',
          'associations.association_id'
        )
        .leftJoin('unions', 'unions.union_id', 'associations.union_id')
        .leftJoin('nominatas', 'nominatas.nominata_id', 'vacancies.nominata_id')
        .select(
          'vacancies.*',
          'ministry_types.ministry_type_name',
          'hiring_status.hiring_status_name',
          'associations.association_name',
          'associations.association_acronym',
          'unions.union_name',
          'unions.union_acronym',
          'nominatas.year',
          'nominatas.orig_field_invites_begin'
        )
        .where('vacancies.nominata_id', findVacanciesData.nominataId)
        .andWhere('vacancies.rep_id', findVacanciesData.repId)

      const vacancies: IVacancy[] = vacanciesConsult.map((vacancy) => {
        return {
          vacancyId: vacancy.vacancy_id,
          title: vacancy.title,
          description: vacancy.description,
          fieldId: vacancy.field_id,
          repId: vacancy.rep_id,
          rep: {
            repId: vacancy.rep_id,
            personId: vacancy.person_id,
            personName: vacancy.person_name,
            phoneNumber: vacancy.person_phone_number
          },
          ministryId: vacancy.ministry_id,
          hiringStatusId: vacancy.hiring_status_id,
          nominataId: vacancy.nominata_id,
          ministry: vacancy.ministry_type_name,
          hiring_status: vacancy.hiring_status_name,
          associationName: vacancy.association_name,
          unionName: vacancy.union_name,
          associationAcronym: vacancy.association_acronym,
          unionAcronym: vacancy.union_acronym,
          nominataYear: vacancy.year,
          originFieldInvitesBegins: vacancy.orig_field_invites_begin,
          vacancyStudents: []
        }
      })

      const vacanciesIds: number[] = vacancies.map(
        (vacancy) => vacancy.vacancyId
      )

      const vacanciesStudentsConsult = await this.knex('vacancies_students')
        .leftJoin(
          'vacancies',
          'vacancies.vacancy_id',
          'vacancies_students.vacancy_id'
        )
        .leftJoin(
          'students',
          'vacancies_students.student_id',
          'students.student_id'
        )
        .leftJoin('people', 'people.person_id', 'students.person_id')
        .leftJoin(
          'associations',
          'students.origin_field_id',
          'associations.association_id'
        )
        .leftJoin('users', 'users.person_id', 'people.person_id')
        .leftJoin('unions', 'unions.union_id', 'associations.union_id')
        .leftJoin(
          'hiring_status',
          'students.hiring_status_id',
          'hiring_status.hiring_status_id'
        )
        .select(
          'vacancies_students.*',
          'people.name',
          'people.person_id',
          'users.user_id',
          'associations.association_name',
          'unions.union_name',
          'associations.association_acronym',
          'unions.union_acronym',
          'hiring_status.hiring_status_name'
        )
        .whereIn('vacancies.vacancy_id', vacanciesIds)
        .andWhere('students.student_approved', true)
        .returning('vacancy_id')

      const vacanciesStudents: IVacancyStudent[] = vacanciesStudentsConsult.map(
        (vacancyStudent) => {
          return {
            vacancyStudentId: vacancyStudent.vacancy_student_id,
            studentId: vacancyStudent.student_id,
            vacancyId: vacancyStudent.vacancy_id,
            comments: vacancyStudent.comments,
            student: {
              association_acronym: vacancyStudent.association_acronym,
              hiring_status_name: vacancyStudent.hiring_status_name,
              name: vacancyStudent.name,
              person_id: vacancyStudent.person_id,
              union_acronym: vacancyStudent.union_acronym,
              student_id: vacancyStudent.student_id,
              user_id: vacancyStudent.user_id,
              small_alone_photo: ''
            },
            invites: []
          }
        }
      )

      const vacanciesStudentsIds: number[] = vacanciesStudentsConsult.map(
        (vacancyStudent) => vacancyStudent.vacancy_id
      )

      const invitesConsult = await this.knex('invites')
        .select('*')
        .whereIn('invites.vacancy_student_id', vacanciesStudentsIds)

      const invites: IInvite[] = invitesConsult.map((invite) => {
        return {
          inviteId: invite.invite_id,
          vacancyStudentId: invite.vacancy_student_id,
          accept: invite.accept,
          deadline: invite.deadline,
          approved: invite.approved
        }
      })

      invites.map((invite) => {
        vacanciesStudents.map((vacancyStudent) => {
          if (vacancyStudent.vacancyStudentId === invite.vacancyStudentId) {
            vacancyStudent.invites.push(invite)
          }
        })
      })

      vacanciesStudents.map((vacancyStudent) => {
        vacancies.map((vacancy) => {
          if (vacancy.vacancyId === vacancyStudent.vacancyId) {
            vacancy.vacancyStudents.push(vacancyStudent)
          }
        })
      })

      return vacancies
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Vaga já existe')
      } else {
        throw new Error(error.sqlMessage)
      }
    }
  }
  async findRepVacancyWhitNotNullAccepts(vacancyId: number): Promise<true> {
    try {
      const vacanciesConsult = await this.knex('vacancies')
        .leftJoin(
          'vacancies_students',
          'vacancies.vacancy_id',
          'vacancies_students.vacancy_id'
        )
        .leftJoin(
          'invites',
          'invites.vacancy_student_id',
          'vacancies_students.vacancy_student_id'
        )
        .first('vacancies.vacancy_id')
        .where('vacancies.vacancy_id', vacancyId)
        .andWhereNot('invites.accept', null)

      if (vacanciesConsult) {
        throw new Error('vacancy already answered')
      }

      return true
    } catch (error) {
      console.error(
        'erro capturado no findRepVacancyWhitNoAccepts no VacanciesService:',
        error
      )
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Vaga já existe')
      } else {
        throw error
      }
    }
  }

  async findAllStudentsWithNoAccepts(nominataId): Promise<IBasicStudent[]> {
    try {
      const studentsConsult = await this.knex('students')
        .leftJoin('users', 'users.person_id', 'students.person_id')
        .leftJoin('people', 'people.person_id', 'students.person_id')
        .leftJoin(
          'associations',
          'associations.association_id',
          'students.origin_field_id'
        )
        .leftJoin('unions', 'unions.union_id', 'associations.union_id')
        .leftJoin(
          'hiring_status',
          'hiring_status.hiring_status_id',
          'students.hiring_status_id'
        )
        .leftJoin(
          'nominatas_students',
          'nominatas_students.student_id',
          'students.student_id'
        )
        .leftJoin(
          'vacancies_students',
          'vacancies.vacancy_id',
          'vacancies_students.vacancy_id'
        )
        .leftJoin(
          'invites',
          'invites.vacancy_student_id',
          'vacancies_students.vacancy_student_id'
        )
        .select(
          'students.student_id',
          'students.person_id',
          'users.user_id',
          'people.name',
          'associations.association_acronym',
          'unions.union_acronym',
          'hiring_status.hiring_status_name'
        )
        .where('nominatas_students.nominata_id', nominataId)
        .andWhereNot('invites.accept', true)
        .whereNotExists(function () {
          this.select('vacancy_student_id')
            .from('invites')
            .whereRaw(
              'invites.vacancy_student_id = vacancies_students.vacancy_student_id'
            )
            .andWhere('invites.accept', true)
        })

      const studentsList: IBasicStudent[] = studentsConsult.map((student) => {
        return {
          student_id: student.student_id,
          user_id: student.user_id,
          person_id: student.person_id,
          name: student.name,
          union_acronym: student.union_acronym,
          association_acronym: student.association_acronym,
          hiring_status_name: student.hiring_status_name,
          small_alone_photo: ''
        }
      })

      return studentsList
    } catch (error) {
      console.error(
        'erro capturado no findRepVacancyWhitNoAccepts no VacanciesService:',
        error
      )
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Vaga já existe')
      } else {
        throw error
      }
    }
  }

  async validateNotAcceptsToVacancy(vacancyId: number): Promise<true> {
    try {
      const vacanciesConsult = await this.knex('vacancies')
        .leftJoin(
          'vacancies_students',
          'vacancies.vacancy_id',
          'vacancies_students.vacancy_id'
        )
        .leftJoin(
          'invites',
          'invites.vacancy_student_id',
          'vacancies_students.vacancy_student_id'
        )
        .first('vacancies.vacancy_id')
        .where('vacancies.vacancy_id', vacancyId)
        .andWhere('invites.accept', true)

      if (vacanciesConsult) {
        throw new Error('vacancy already accepted')
      }

      return true
    } catch (error) {
      console.error(
        'erro capturado no findRepVacancyWhitNoAccepts no VacanciesService:',
        error
      )
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Vaga já existe')
      } else {
        throw error
      }
    }
  }

  async validateNotAcceptsToStudent(studentId: number): Promise<true> {
    try {
      const studentsConsult = await this.knex('students')
        .leftJoin(
          'vacancies_students',
          'vacancies.student_id',
          'vacancies_students.student_id'
        )
        .leftJoin(
          'invites',
          'invites.vacancy_student_id',
          'vacancies_students.vacancy_student_id'
        )
        .first('students.student_id')
        .where('students.student_id', studentId)
        .andWhere('invites.accept', true)

      if (studentsConsult) {
        throw new Error('student already accepted another vacancy')
      }

      return true
    } catch (error) {
      console.error(
        'erro capturado no findRepVacancyWhitNoAccepts no VacanciesService:',
        error
      )
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Vaga já existe')
      } else {
        throw error
      }
    }
  }

  async validateNotAcceptsToStudentAndToVacancy(
    vacancyStudentId: number
  ): Promise<true> {
    try {
      const studentsConsult = await this.knex('vacancies_students')
        .leftJoin(
          'invites',
          'invites.vacancy_student_id',
          'vacancies_students.vacancy_student_id'
        )
        .first('invites.invite_id')
        .where('vacancies_students.vacancy_student_id', vacancyStudentId)
        .andWhereNot('invites.accept', null)

      if (studentsConsult) {
        throw new Error('student already answered this vacancy')
      }

      return true
    } catch (error) {
      console.error(
        'erro capturado no findRepVacancyWhitNoAccepts no VacanciesService:',
        error
      )
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Vaga já existe')
      } else {
        throw error
      }
    }
  }
}
