import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { AuthRequest } from 'src/shared/auth/types/types';
import { IRole } from 'src/shared/roles/bz_types/types';
import { ApprovedBy } from 'src/modules/users/hz_maps/users.maps'

@Injectable()
export class UsersGuard implements CanActivate {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    
      
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const approverUserRoles:string[] = request.user.roles.map(role => role.role_name);
    const approvedUserRoles:string[] = request.body.roles.map(role => role.role_name);
    
    let supRoles: string[] | undefined = []
    let found: boolean = true

    approvedUserRoles.forEach(approved=>{
       supRoles = ApprovedBy.get(approved)
       let found = supRoles?.some((role)=> approverUserRoles.includes(role))
       if(!found){
        found = false
       }
    })
    if(!found){
        return false
    }
    return true
  }
}