import { IFieldRep } from 'src/modules/field-reps/types/types'
import { IBasicStudent } from 'src/modules/nominatas/types/types'
import {
  IBasicVacancyStudent,
  ICompleteVacancyStudent
} from 'src/modules/vacancies/types/types'

export interface ICreateInvite {
  vacancyStudentId: number
  accept: boolean | null
  deadline: Date
  approved: boolean | null
  voteDate: Date
  voteNumber: string
  studentId: number
}

export interface IEvaluateInvite {
  inviteId: number
  approved: boolean
}

export interface IAcceptInvite {
  inviteId: number
  studentId: number
  accept: boolean
  hiringStatusId: number
}

export interface ICompleteInvite {
  inviteId: number
  vacancyStudent: ICompleteVacancyStudent
  accept: boolean
  deadline: Date
  approved: boolean
  voteDate: Date
  voteNumber: string
}

export interface IInvite {
  inviteId: number
  deadline: Date
  accept: boolean
  approved: boolean
  vacancyStudent: IBasicVacancyStudent
  voteDate: Date
  voteNumber: string
}
