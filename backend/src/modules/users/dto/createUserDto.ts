import { IsNotEmpty, IsNumber, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+-={}|[\]:";'<>,.?/~`]).{8,}$/,
    {
      message:
        'A senha deve possuir letras minúsculas, maiúsculas, numeros e caracteres especiais.',
    },
  )
  password: string;

  @IsNumber()
  personId: number;

 @IsNotEmpty()
  rolesId: number[]
}
