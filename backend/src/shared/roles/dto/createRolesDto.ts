import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @MinLength(2)
  roleName: string;

  @IsNotEmpty()
  @MinLength(2)
  roleDescription: string;
}
