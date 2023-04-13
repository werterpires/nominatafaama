import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/createUserDto';
import { UsersModel } from '../model/users.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserService {
  constructor(private readonly usersModel: UsersModel) {}

  async createUser({ password, personId, rolesId }: CreateUserDto) {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.usersModel.createUser({
      passwordHash,
      personId,
      rolesId,
    });
    return user;
  }
}
