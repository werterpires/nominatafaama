import { IFieldRep } from 'src/modules/field-reps/types/types'

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

export interface IInvite {
  inviteId: number
  vacancyStudentId: number
  accept: boolean | null
  deadline: Date
  approved: boolean | null
}

export interface IVacancyStudent {
  vacancyStudentId: number
  studentId: number
  vacancyId: number
  comments: string
  name: string
  associationName: string
  unionName: string
  associationAcronym: string
  unionAcronym: string
  hiringStatus: string
  invites: IInvite[]
}
