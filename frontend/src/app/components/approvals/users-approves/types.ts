import { IRole } from '../../shared/container/types'

export interface ApproveUserDto {
  user_id: number
  roles?: IRole[]
  user_approved: boolean
}

export interface UsersAprovesTypes {
  [key: string]: boolean // Add an index signature
}

export interface UserType {
  requiredRole: string
  name: string
}
