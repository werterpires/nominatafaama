import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../az_dto/createUserDto';
import { UsersModel } from '../ez_model/users.model';
import * as bcrypt from 'bcrypt';
import { IAproveUser, IBasicUser, ICreateUser, IUpdateUser, IUser, IValidateUser } from '../bz_types/types';

@Injectable()
export class UsersService {
  constructor(private readonly usersModel: UsersModel) {}

  async createUser(dto: CreateUserDto): Promise<IUser> {
    let { passwordHash, principalEmail, name, cpf, rolesId } = dto;
    
    passwordHash = await bcrypt.hash(passwordHash, 10);

    const createUser: ICreateUser = {
      password_hash: passwordHash,
      principal_email: principalEmail,
      name: name,
      cpf: cpf,
      role_id: rolesId,
    };
  
    let user: IUser;
  
    try {
      user = await this.usersModel.createUser(createUser);
    } catch (error) {
  
      throw error
    }
  
    return user;
  }

  async findUserById(id: number): Promise<IUser | null> {
    try {
      const user = await this.usersModel.findUserById(id);
      return user;
    } catch (error) {
      throw new Error(`Não foi possível encontrar o usuário com id ${id}: ${error.message}`);
    }
  }  

  async findUserByEmail(email: string): Promise<IValidateUser | null> {
    let basicUser: IValidateUser | null = null;
  
    try {
      basicUser = await this.usersModel.findUserByEmail(email);
    } catch (error) {
      throw error;
    }
  
    if (!basicUser) {
      throw new Error(`User with email ${email} not found.`);
    }
    
    return basicUser;
  }

  async findAllUsers(): Promise<IUser[]> {
    try {
      const users = await this.usersModel.findAllUsers();
      return users;
    } catch (error) {
      throw error;
    }
  }


  async approveUserById({ user_id, user_approved }: IAproveUser): Promise<IAproveUser> {
    try {
      const updatedUser = await this.usersModel.aproveUserById({user_id, user_approved});
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async updateUserById(id: number, updateUser: IUpdateUser): Promise<IUser> {
  let updatedUser:IUser | null = null
  let sentError: Error | null = null
  let isPasswordValid
    try {
      const realPassword = await this.usersModel.findPasswordById(id)
      if(typeof realPassword === 'string'){
        isPasswordValid = await bcrypt.compare(updateUser.current_password_hash, realPassword);
      }else{
        throw new Error('Senha não encontrada.')
      }

      if(!isPasswordValid){
        throw new Error('A senha fornecida não confere.')
      }

      if(updateUser.password_hash){
        updateUser.password_hash = await bcrypt.hash(updateUser.password_hash, 10)
      }

       updatedUser = await this.usersModel.updateUserById(id, updateUser);
    } catch (error) {
      sentError = new Error(error.message);
  
    }
    
    if(sentError !== null){
    
      throw sentError
    }
    if(updatedUser===null){
      throw new Error('O usuário não pôde ser atualizado')
    }

    return updatedUser;
  }
  
  async deleteUserById(id: number): Promise<string> {
    try {
      const message = await this.usersModel.deleteUserById(id);
      return message;
    } catch (error) {
      throw error;
    }
  }
}
