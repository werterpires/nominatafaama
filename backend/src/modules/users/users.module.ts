import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { FindAllUsersService } from './services/findAllUsers.service';
import { UsersModel } from './model/users.model';
import { CreateUserService } from './services/createUser.service';

const services = [
  FindAllUsersService,
  UsersModel,
  CreateUserService,
  FindAllUsersService,
];

@Module({
  imports: [],
  controllers: [UsersController],
  providers: services,
  exports: services,
})
export class UsersModule {}
