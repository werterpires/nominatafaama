import {
  BadRequestException,
  ForbiddenException,
  Injectable
} from '@nestjs/common'
import { UserFromJwt } from 'src/shared/auth/types/types'
import { UsersToApproveModel } from '../ez_model/usersApprove.model'
import { CanApprove, RolesWeights } from '../hz_maps/users.maps'
import { IRole } from 'src/shared/roles/bz_types/types'

@Injectable()
export class UsersToApproveService {
  approvedBoolean: Record<string, boolean | null> = {
    true: true,
    false: false,
    null: null
  }

  constructor(private readonly usersModel: UsersToApproveModel) {}

  async findUsersToApprove(
    currentUser: UserFromJwt,
    requiredRole: string,
    statusString: string
  ) {
    if (!this.validateRolesToApprove(currentUser.roles, requiredRole)) {
      throw new ForbiddenException(
        '#Você não possui permissão para aprovar o papel de usuário solicitado.'
      )
    }

    const status: boolean | null = this.approvedBoolean[statusString]

    if (status === undefined) {
      throw new BadRequestException(
        '#O valor do status deve ser true, false ou null.'
      )
    }

    const allSelectedUsers = await this.usersModel.findUsersToApprove(
      requiredRole,
      status
    )

    const filteredUsers = allSelectedUsers.filter((user) => {
      return user.roles.every((role) => {
        return RolesWeights[role.role_name] <= RolesWeights[requiredRole]
      })
    })

    return filteredUsers
  }

  validateRolesToApprove(currentUserRoles: IRole[], requiredRole: string) {
    const approvableRolesSet = new Set<string>()

    currentUserRoles.forEach((role) => {
      const approvableRoles = CanApprove.get(role.role_name)
      if (approvableRoles) {
        approvableRoles.forEach((approvableRole) => {
          approvableRolesSet.add(approvableRole)
        })
      }
    })

    const approvableRoles = Array.from(approvableRolesSet)

    return approvableRoles.includes(requiredRole)
  }
}
