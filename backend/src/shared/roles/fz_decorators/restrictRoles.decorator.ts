import { SetMetadata } from '@nestjs/common';
import { ERoles } from '../../auth/types/roles.enum';

export const RestrictRoles = (...restrictRoles: ERoles[]) => SetMetadata('restrictRoles', restrictRoles);
