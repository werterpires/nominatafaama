import { IBasicStudent } from '../nominata/types'
import { IFieldRep } from '../records/field-reps/types'

export interface CreateVacancyDto {
  ministryId: number

  title: string

  description: string

  hiringStatusId: number

  nominataId: number
}

export interface UpdateVacancyDto {
  vacancyId: number
  ministryId: number
  title: string
  description: string
  hiringStatusId: number
}

export interface ICompleteVacancyStudent {
  vacancyStudentId: number
  studentId: number
  vacancyId: number
  comments: string
  student: IBasicStudent
  vacancy: ICompleteVacancy
}

export interface ICompleteVacancy {
  vacancyId: number
  title: string
  description: string
  fieldId: number
  repId: number
  ministryId: number
  hiringStatusId: number
  nominataId: number
  rep: IFieldRep
  ministry: string
  hiring_status: string
  associationName: string
  unionName: string
  associationAcronym: string
  unionAcronym: string
  nominataYear: string
  originFieldInvitesBegins: Date
}
