import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IValidateUser } from 'src/modules/users/bz_types/types';
import { AuthRequest } from '../types/types';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): IValidateUser => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return request.user;
  },
);
