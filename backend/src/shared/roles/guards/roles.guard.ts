import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { AuthRequest } from 'src/shared/auth/types/types';

@Injectable()
export class RolesGuard implements CanActivate {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ERoles[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<AuthRequest>();

    const user = request.user;

    const usersRoles: string[] = [];

    user.roles.forEach((role) => {
      usersRoles.push(role.role_name);
    });
    // eslint-disable-next-line array-callback-return
    return requiredRoles.some((role) => usersRoles.includes(role));
  }
}
