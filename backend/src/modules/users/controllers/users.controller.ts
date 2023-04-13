import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator';
import { IsPublic } from 'src/shared/auth/decorators/is-public.decorator';
import { Roles } from 'src/shared/roles/decorators/roles.decorator';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { CreateUserDto } from '../dto/createUserDto';
import { CreateUserService } from '../services/createUser.service';
import { FindAllUsersService } from '../services/findAllUsers.service';
import { IUser } from '../types';

@Controller('users')
export class UsersController {
  constructor(
    private readonly findAllUsersService: FindAllUsersService,
    private readonly createUserService: CreateUserService,
  ) { }

  @Roles(ERoles.ADMINISTRADOR, ERoles.PROPRIETARIO)
  @Get()
  async findAllUsers(@CurrentUser() user: IUser) {
    return await this.findAllUsersService.findAllUsers();
  }

  @Roles(ERoles.ADMINISTRADOR)
  @Post()
  async createUser(@Body() input: CreateUserDto) {
    console.log('no controller')
    return await this.createUserService.createUser(input);
  }
}
