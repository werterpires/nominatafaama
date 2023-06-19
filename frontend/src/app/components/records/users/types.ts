import { IRole } from '../../shared/container/types'

export interface IUser {
  user_approved?: boolean | null
  user_id: number
  principal_email: string
  person_id: number
  name: string
  cpf: string
  roles: IRole[]
  created_at: Date
  updated_at: Date
}
