import { IRole } from 'src/shared/roles/bz_types/types';

export interface IUser {
  user_id: number;
  principal_email: string;
  person_id: number;
  name: string;
  cpf: string;
  roles: IRole[];
  created_at: Date;
  updated_at: Date;
}

export interface IValidateUser {
  user_id: number;
  principal_email: string;
  password_hash: string;
  person_id: number;
  name: string;
  cpf: string;
  roles: IRole[];
  created_at: Date;
  updated_at: Date;
}

export interface ICreateUser {
 
  password_hash: string;
  principal_email: string;
  name: string;
  cpf: string;
  role_id: number[]

}

export interface IUpdateUser {
 
  password_hash?: string;
  principal_email?: string;
  name?: string;
  cpf?: string;
  roles_id?: number[]
  current_password_hash: string;

}

export interface IBasicUser {
  user_id: number;
  password_hash: string;
  principal_email: string;
  roles: IRole[]
  name: string;
}

export interface IAproveUser {
  user_id: number;
  user_approved: boolean;
}


