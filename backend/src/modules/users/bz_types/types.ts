import { IRole } from 'src/shared/roles/bz_types/types'
import { ITerm } from 'src/shared/terms/types/types'

export interface IUser {
  user_approved?: boolean
  user_id: number
  principal_email: string
  person_id: number
  name: string
  cpf: string
  roles: IRole[]
  created_at: Date
  updated_at: Date
}

export interface IValidateUser {
  user_id: number
  principal_email: string
  password_hash: string
  person_id: number
  name: string
  cpf: string
  roles: IRole[]
  created_at: Date
  updated_at: Date
  user_approved: boolean
}

export interface ICreateUser {
  password_hash: string
  principal_email: string
  name: string
  cpf: string
  role_id: number[]
  roles: ItermUser[]
}

export interface IUpdateUser {
  password_hash?: string
  principal_email?: string
  name?: string
  cpf?: string
  roles_id?: number[]
  current_password_hash: string
  user_approved: boolean | null
}

export interface IBasicUser {
  user_id: number
  password_hash: string
  principal_email: string
  roles: IRole[]
  name: string
}

export interface IAproveUser {
  user_id: number
  user_approved: boolean
}

export interface ItermUser {
  role_id: number
  sign: boolean
}
