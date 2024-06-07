import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { AuthRequest } from 'src/shared/auth/types/types'
import { IRole } from 'src/shared/roles/bz_types/types'
import { ApprovedBy } from 'src/modules/users/hz_maps/users.maps'

@Injectable()
export class UsersGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>()
    const approverUserRoles: string[] = request.user.roles.map(
      (role) => role.role_name
    )
    const approvedUserRoles: string[] = request.body.roles.map(
      (role) => role.role_name
    )

    let found: boolean = true

    approvedUserRoles.forEach((approved) => {
      const supRoles = ApprovedBy.get(approved)
      found =
        supRoles?.some((role) => approverUserRoles.includes(role)) ?? false
      if (!found) {
        return false
      }
    })

    return found
  }
}
