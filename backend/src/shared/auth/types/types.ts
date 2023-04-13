import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Request } from 'express';
import { IUser } from '../../../modules/users/types';

export interface AuthRequest extends Request {
  user: IUser;
}

export interface UserPayload {
  sub: number;
  email: string;
  surname: string;
  roles: object;
  iat?: number;
  exp?: number;
}

export interface UserToken {
  access_token: string;
}

export interface UserFromJwt {
  id: number;
  email: string;
  surname: string;
  roles: object;
}

export class LoginRequestBody {
  @IsEmail()
  email: string;

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
}
