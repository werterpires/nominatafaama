import { ICompleteVacancyStudent } from '../types'

export interface IBasicInviteData {
  deadline: string
  voteDate: string
  voteNumber: string
}

export interface ICompleteInvite {
  inviteId: number
  vacancyStudent: ICompleteVacancyStudent
  accept: boolean
  deadline: string
  approved: boolean
  voteDate: string
  voteNumber: string
}
