import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { AuthRequest } from 'src/shared/auth/types/types'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ERoles[]>('roles', [
      context.getHandler(),
      context.getClass()
    ])

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!requiredRoles) {
      return true
    }

    const restrictRoles = this.reflector.getAllAndOverride<ERoles[]>(
      'restrictRoles',
      [context.getHandler(), context.getClass()]
    )

    const request = context.switchToHttp().getRequest<AuthRequest>()
    const user = request.user
    const userId = Number(request.params.id)
    const approved = user.user_approved

    if (!approved) {
      throw new ForbiddenException(
        'Seu usuário deve ser aprovado antes de executar essa ação.'
      )
    }

    const userRoles: string[] = []
    let matchUserRoles: string[] = []

    user.roles.forEach((role) => {
      userRoles.push(role.role_name)
    })

    requiredRoles.forEach((role) => {
      if (userRoles.includes(role)) {
        matchUserRoles.push(role)
      }
    })

    if (matchUserRoles.length < 1) {
      throw new ForbiddenException(
        'Você não tem um papel válido para acessar esse recurso'
      )
    }

    if (restrictRoles !== undefined) {
      restrictRoles.forEach((role) => {
        matchUserRoles = matchUserRoles.filter((r) => r !== role)
      })
    }

    if (matchUserRoles.length > 0) {
      return true
    }

    if (userId !== user.user_id) {
      throw new ForbiddenException(
        'Esse recurso só pode ser acessado pelo próprio usuário'
      )
    }

    return true
  }
}
