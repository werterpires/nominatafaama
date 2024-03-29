import { IBasicStudent } from '../../nominata/types'
import { IFieldRep } from '../../records/field-reps/types'

export interface IVacancy {
  vacancyId: number
  title: string
  description: string
  fieldId: number
  repId: number
  rep: IFieldRep
  ministryId: number
  hiringStatusId: number
  nominataId: number
  ministry: string
  hiring_status: string
  associationName: string
  unionName: string
  associationAcronym: string
  unionAcronym: string
  nominataYear: string
  originFieldInvitesBegins: Date
  vacancyStudents: IVacancyStudent[]
}

export interface IVacancyStudent {
  vacancyStudentId: number
  studentId: number
  student: IBasicStudent
  vacancyId: number
  comments: string
  invites: IInvite[]
}

export interface IInvite {
  inviteId: number
  vacancyStudentId: number
  accept: boolean | null
  deadline: string
  approved: boolean | null
  voteDate: string
  voteNumber: string
}

export interface CreateVacancyStudentDto {
  studentId: number
  vacancyId: number
  comments: string
}

export interface UpdateVacancyStudentDto {
  vacancyStudentId: number
  comments: string
}

export interface CreateInviteDto {
  vacancyStudentId: number
  vacancyId: number
  studentId: number
  deadline: string
  voteNumber: string
  voteDate: string
}
