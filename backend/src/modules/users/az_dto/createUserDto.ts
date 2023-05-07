import { IsBoolean, IsNotEmpty, IsString, Length, MinLength, isNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  passwordHash: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  principalEmail: string;

  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @Length(11)
  cpf: string;

  @IsNotEmpty()
  rolesId: number[]

}

