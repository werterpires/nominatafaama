import { SetMetadata } from '@nestjs/common';
import { ERoles } from '../../auth/types/roles.enum';

export const Roles = (...roles: ERoles[]) => SetMetadata('roles', roles);
