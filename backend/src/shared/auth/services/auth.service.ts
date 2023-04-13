import { Injectable } from '@nestjs/common';
import { FindUserByEmail } from 'src/modules/users/services/findUserByEmail.service';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/modules/users/types';
import { UserPayload, UserToken } from '../types/types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly findUserByEmail: FindUserByEmail,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user: IUser[] = await this.findUserByEmail.findUserByEmail(email);
    if (user[0].user_id > 0) {
      
      const isPasswordValid = await bcrypt.compare(
        password,
        user[0].password_hash,
      );

      if (isPasswordValid) {
        return {
          ...user[0],
          password_hash: undefined,
        };
      }
    }
    throw new Error('Email e/ou a senha não encontrado(s)');
  }

  login(user: IUser): UserToken {
    const payload: UserPayload = {
      sub: user.user_id,
      email: user.email,
      surname: user.surname,
      roles: user.roles,
    };
    const jwtToken = this.jwtService.sign(payload);
    return { access_token: jwtToken };
  }
}
