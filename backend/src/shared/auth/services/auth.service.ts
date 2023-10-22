import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/dz_services/users.service';
import * as bcrypt from 'bcrypt';
import { IValidateUser, IUser } from 'src/modules/users/bz_types/types';
import { UserPayload, UserToken } from '../types/types';
import { JwtService } from '@nestjs/jwt';
import { StudentsModel } from 'src/modules/students/model/students.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private studentsModel: StudentsModel
  ) {}

  async validateUser(email: string, password: string) {
    const user: IValidateUser | null = await this.usersService.findUserByEmail(
      email
    );

    if (user && user.user_id > 0) {
      const active = await this.studentsModel.findActiveByUserId(user.user_id);

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (isPasswordValid && active != false) {
        return {
          ...user,
          password_hash: undefined,
        };
      } else if (!isPasswordValid) {
        throw new Error('Email e/ou a senha não encontrado(s)');
      } else if (active == false) {
        console.log(isPasswordValid, active);
        throw new Error('Estudante inativo');
      }
    }
    throw new Error('Email e/ou a senha não encontrado(s)');
  }

  async login(user: IValidateUser): Promise<UserToken> {
    const payload: UserPayload = {
      sub: user.user_id,
      principal_email: user.principal_email,
      name: user.name,
      roles: user.roles,
      user_approved: user.user_approved,
    };
    const jwtToken = this.jwtService.sign(payload);
    return { access_token: jwtToken };
  }
}
