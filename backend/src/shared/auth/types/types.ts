import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator'
import { Request } from 'express'
import { IValidateUser, IUser } from '../../../modules/users/bz_types/types'
import { IRole } from 'src/shared/roles/bz_types/types'

export interface AuthRequest extends Request {
  user: IValidateUser
}

export interface UserPayload {
  principal_email: string
  sub: number
  name: string
  user_approved: boolean
  roles: IRole[]
  iat?: number
  exp?: number
}

export interface UserToken {
  access_token: string
}

export interface UserFromJwt {
  user_id: number
  principal_email: string
  name: string
  roles: IRole[]
  user_approved: boolean
}

export class LoginRequestBody {
  @IsEmail()
  email: string

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+-={}|[\]:";'<>,.?/~`]).{8,}$/,
    {
      message:
        'A senha deve possuir letras minúsculas, maiúsculas, numeros e caracteres especiais.'
    }
  )
  password: string
}
