import { IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class CreateUsersRoleDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  roleId: number;
}
