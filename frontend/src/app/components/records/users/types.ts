import { IRole } from '../../shared/container/types'

export interface IUser {
  user_approved?: boolean | null
  user_id: number
  principal_email: string
  person_id: number
  name: string
  cpf: string
  roles: IRole[]
  created_at: string
  updated_at: string
}

export interface UpdateUserDto {
  password_hash?: string
  principal_email?: string
  roles_id?: number[]
  name?: string
  cpf?: string
  current_password_hash: string
}
