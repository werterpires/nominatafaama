import { IFieldRep } from 'src/modules/field-reps/types/types'
import { IBasicStudent } from 'src/modules/nominatas/types/types'

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
  vacancyStudents: IMediumVacancyStudent[]
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

export interface ICreateDirectVacancy {
  student_id: number
  field_id: number
  title: string
  description: string
  accept: boolean | null
  approved: boolean | null
  deadline: Date
  hiring_status_id: number
}

export interface ICreateVacancy {
  repId: number
  fieldId: number
  ministryId: number
  title: string
  description: string
  hiringStatusId: number
  nominataId: number
}

export interface IUpdateVacancy {
  vacancyId: number
  ministryId: number
  title: string
  description: string
  hiringStatusId: number
}

export interface IBasicInvite {
  inviteId: number
  vacancyStudentId: number
  accept: boolean | null
  deadline: Date
  approved: boolean | null
}

export interface IMediumVacancyStudent {
  vacancyStudentId: number
  studentId: number
  student: IBasicStudent
  vacancyId: number
  comments: string
  invites: IBasicInvite[]
}

export interface ICompleteVacancyStudent {
  vacancyStudentId: number
  studentId: number
  vacancyId: number
  comments: string
  student: IBasicStudent
  vacancy: ICompleteVacancy
}

export interface IAddStudentToVacancy {
  studentId: number
  vacancyId: number
  comments: string
}

export interface IUpdateVacancyStudent {
  vacancyStudentId: number
  comments: string
}

export interface IBasicVacancyStudent {
  vacancyStudentId: number
  studentId: number
  vacancyId: number
  comments: string
}
