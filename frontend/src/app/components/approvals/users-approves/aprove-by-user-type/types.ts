import { IRole } from 'src/app/components/shared/container/types'

export interface ApproveUserObj {
  approveString: string
  rejectString: string
  userId: number
  userRoles: IRole[]
}

export interface GetUserObj {
  requiredRole: string
  status: boolean | null
}
