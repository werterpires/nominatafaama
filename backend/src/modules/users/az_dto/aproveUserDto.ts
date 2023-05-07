import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';
import { IRole } from 'src/shared/roles/bz_types/types';

export class AproveUserDto {
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  roles?: IRole[]

  @IsNotEmpty()
  @IsBoolean()
  user_approved: boolean

}

