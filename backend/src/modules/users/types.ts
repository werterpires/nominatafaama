import { IRole } from 'src/shared/roles/types';

export interface IUser {
  user_id: number;
  password_hash: string;
  email: string;
  first_names: string;
  surname: string;
  cpf: string;
  address_id: number;
  roles: IRole[];
  role_id?: number;
  role_name?: string;
  role_description?: string;
  person_id: number;
  created_at: string;
  updated_at: string;
}

export interface ICreateUser {
  passwordHash: string;
  personId: number;
  rolesId: number[]
}
