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
}

export interface IEvaluateInvite {
  inviteId: number
  approved: boolean
}

export interface IAcceptInvite {
  inviteId: number
  accept: boolean
}

export interface ICompleteInvite {
  inviteId: number
  vacancyStudent: ICompleteVacancyStudent
  accept: boolean
  deadline: Date
  approved: boolean
}

export interface IInvite {
  inviteId: number
  deadline: Date
  accept: boolean
  approved: boolean
  vacancyStudent: IBasicVacancyStudent
}