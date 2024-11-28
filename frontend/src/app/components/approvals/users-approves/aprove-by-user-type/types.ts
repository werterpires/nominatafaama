import { IRole } from 'src/app/components/shared/container/types'

export interface ApproveUserObj {
  approveString: boolean | null
  userId: number
  userRoles: IRole[]
}

export interface GetUserObj {
  requiredRole: string
  status: boolean | null
}
