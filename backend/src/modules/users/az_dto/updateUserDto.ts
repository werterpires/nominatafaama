import { IsNotEmpty, IsOptional, IsString, Length, MinLength, ValidateIf, isObject } from 'class-validator';

export class UpdateUserDto {

  @IsOptional()
  @IsString()
  @Length(1, 255)
  password_hash?: string;

  @IsOptional()
  @IsString()
  @Length(1, 150)
  principal_email?: string;

  @IsOptional()
  roles_id?: number[];
  
  @IsOptional()
  @MinLength(2)
  name?: string;
  
  @IsOptional()
  @Length(11)
  cpf?: string;

  @IsString()
  @Length(1, 255)
  current_password_hash: string;

}
