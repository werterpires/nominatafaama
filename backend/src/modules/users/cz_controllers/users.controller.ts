import { Body, Controller, Delete, ExecutionContext, Get, InternalServerErrorException, NotFoundException, Param, Post, Put, Req, Request, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator';
import { IsPublic } from 'src/shared/auth/decorators/is-public.decorator';
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { CreateUserDto } from '../az_dto/createUserDto';
import { UsersService } from '../dz_services/users.service';
import { IAproveUser, IUpdateUser, IUser } from '../bz_types/types';
import { AuthRequest } from 'src/shared/auth/types/types';
import { RestrictRoles } from 'src/shared/roles/fz_decorators/restrictRoles.decorator';
import { UsersGuard } from '../gz_guards/users.guard';
import { AproveUserDto } from '../az_dto/aproveUserDto';
import { UpdateUserDto } from '../az_dto/updateUserDto';


@Controller('users')
  export class UsersController {
    constructor(
      private readonly usersService: UsersService, 
    ) {}

  @IsPublic()
  @Post()
  async createUser(
    @Body() input: CreateUserDto) {
    try {
      const user = await this.usersService.createUser(input);
      return user;

    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @RestrictRoles(ERoles.ESTUDANTE)
  @Get('find/:id')
  async getUserById(@Param('id') id: number) {
    try {
      const user = await this.usersService.findUserById(id);
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DIRECAO)
  @Get()
  async findAllUsers() {
    return await this.usersService.findAllUsers();
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @UseGuards(UsersGuard)
  @Put('aprove')
  async aproveUserById(@Body() input: AproveUserDto){
   
    try{
      delete input.roles;   
      const approvedUser = await this.usersService.approveUserById(input);
      return approvedUser
    }catch(error){
      throw new InternalServerErrorException(error.message)
    }
    
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DIRECAO, ERoles.DOCENTE, ERoles.ESTUDANTE, ERoles.REPRESENTACAO, ERoles.SECRETARIA)
  @Put('update')
  async updateUserById(@Body() input: UpdateUserDto, @CurrentUser() user:IUser) {
    try{
      const id = user.user_id
      const updatedUser = await this.usersService.updateUserById(id, input)
      return updatedUser
    }catch(error){
      throw new InternalServerErrorException(error.message)
    }
    
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DIRECAO, ERoles.DOCENTE, ERoles.ESTUDANTE, ERoles.REPRESENTACAO, ERoles.SECRETARIA)
  @Delete()
  async deleteUserById(@CurrentUser() user:IUser) {
    try {
      const id = user.user_id
      const message = await this.usersService.deleteUserById(id);
      return { message };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  
}
