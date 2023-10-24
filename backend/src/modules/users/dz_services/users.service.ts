import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../az_dto/createUserDto';
import { UsersModel } from '../ez_model/users.model';
import * as bcrypt from 'bcrypt';
import {
  IAproveUser,
  IBasicUser,
  ICreateUser,
  IUpdateUser,
  IUser,
  IValidateUser,
} from '../bz_types/types';
import { UpdateUserDto } from '../az_dto/updateUserDto';
import * as Nodemailer from 'nodemailer';
import { ITerm } from 'src/shared/terms/types/types';
import { UserFromJwt } from 'src/shared/auth/types/types';

@Injectable()
export class UsersService {
  constructor(private readonly usersModel: UsersModel) {}

  async createUser(dto: CreateUserDto): Promise<IUser> {
    let { passwordHash, principalEmail, name, cpf, roles } = dto;

    passwordHash = await bcrypt.hash(passwordHash, 10);
    let rolesId: number[] = roles.map((item) => item.role_id);

    const createUser: ICreateUser = {
      password_hash: passwordHash,
      principal_email: principalEmail,
      name: name,
      cpf: cpf,
      role_id: rolesId,
      roles,
    };

    let user: IUser;

    try {
      user = await this.usersModel.createUser(createUser);
    } catch (error) {
      console.log('error no service:', error);
      throw error;
    }

    return user;
  }

  async findUserById(id: number): Promise<IUser | null> {
    try {
      const user = await this.usersModel.findUserById(id);
      return user;
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar o usuário com id ${id}: ${error.message}`
      );
    }
  }

  async findNotSignedTerms(currentUser: IUser): Promise<ITerm[] | null> {
    try {
      let rolesIds = currentUser.roles.map((role) => role.role_id);

      const terms = await this.usersModel.findNotSignedTerms(
        rolesIds,
        currentUser.user_id
      );
      return terms;
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar termos não assinados para os papeis com id ${currentUser.roles}: ${error.message}`
      );
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

  async approveUserById(
    { user_id, user_approved }: IAproveUser,
    currentUser: UserFromJwt
  ): Promise<IAproveUser> {
    try {
      const updatedUser = await this.usersModel.aproveUserById(
        {
          user_id,
          user_approved,
        },
        currentUser
      );
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async updateUserById(id: number, updateUser: UpdateUserDto): Promise<IUser> {
    let updatedUser: IUser | null = null;
    let sentError: Error | null = null;
    let isPasswordValid;
    try {
      const realPassword = await this.usersModel.findPasswordById(id);
      if (typeof realPassword === 'string') {
        isPasswordValid = await bcrypt.compare(
          updateUser.current_password_hash,
          realPassword
        );
      } else {
        throw new Error('Senha não encontrada.');
      }

      if (!isPasswordValid) {
        throw new Error('A senha fornecida não confere.');
      }

      if (updateUser.password_hash) {
        updateUser.password_hash = await bcrypt.hash(
          updateUser.password_hash,
          10
        );
      }
      const updateUserDAta: IUpdateUser = {
        ...updateUser,
        user_approved: null,
      };

      updatedUser = await this.usersModel.updateUserById(id, updateUserDAta);
    } catch (error) {
      sentError = new Error(error.message);
    }

    if (sentError !== null) {
      throw sentError;
    }
    if (updatedUser === null) {
      throw new Error('O usuário não pôde ser atualizado');
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

  getRandomChar(characters: string): string {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
  }

  async recoverPass(email: string): Promise<boolean> {
    try {
      const numerals = '0123456789';
      const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
      const symbols = '!@#$%&*_-?/~';
      const allCharacters =
        numerals + uppercaseLetters + lowercaseLetters + symbols;

      let pass = '';

      pass += this.getRandomChar(numerals);
      pass += this.getRandomChar(uppercaseLetters);
      pass += this.getRandomChar(lowercaseLetters);
      pass += this.getRandomChar(symbols);

      for (let i = 4; i < 10; i++) {
        pass += this.getRandomChar(allCharacters);
      }

      pass = pass
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('');

      const passHash = await bcrypt.hash(pass, 10);

      const now = new Date().toISOString();

      const foundUser = await this.usersModel.createRecoverPass(
        now + passHash,
        email
      );

      if (foundUser == 0) {
        return true;
      } else if (foundUser == 2) {
        return false;
      }

      const transporter = Nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'werter.pires@solovidasementes.com.br',
          pass: 'njxwnlsjkiuhengw',
        },
      });

      const mailOptions = {
        from: 'werter.pires@solovidasementes.com.br',
        to: email,
        subject: 'Alteração de Senha',
        text: `Você solicitou uma nova senha?,

        Sua senha agora é ${pass} para ativar sua conta.`,
        html: `
        <div style="background-color: green">
          <h1>Recuperação de senha</h1>
          <p>Você solicitou alteração de senha.</p> </hr>
          <p>Utilize a senha ${pass} no campo de recuperação de senha para trocar sua senha.</p></hr></hr>
          <p>Se você não solicitou essa alteração, apenas ignore este email.</p>
        </div>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log('Erro ao enviar email: ', error);
        } else {
          console.log('Email enviado:', info.response);
        }
      });

      return true;
    } catch (error) {
      console.error(`Erro capturado no UsersService recoverPass: ${error}`);
      throw error;
    }
  }

  async comparePassCode(email: string, pass: string): Promise<boolean> {
    let sentError: Error | null = null;
    let isPassValid: boolean = false;
    try {
      const atualPass = await this.usersModel.findPassCodeByEmail(email);

      let lessOneHour: boolean = true;

      if (atualPass && atualPass.length > 24) {
        lessOneHour =
          new Date().getTime() - new Date(atualPass.slice(0, 24)).getTime() >
          3600000;
      }
      if (lessOneHour) {
        isPassValid = false;
        return isPassValid;
      }
      if (atualPass != null) {
        const truePass = atualPass.slice(24);

        isPassValid = await bcrypt.compare(pass, truePass);
      }
    } catch (error) {
      sentError = new Error(error.message);
    }

    if (sentError !== null) {
      throw sentError;
    }

    return isPassValid;
  }

  async changewPassword(email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    let done: number = 0;

    try {
      done = await this.usersModel.createPassword(email, passwordHash);
    } catch (error) {
      throw error;
    }

    return done;
  }
}
