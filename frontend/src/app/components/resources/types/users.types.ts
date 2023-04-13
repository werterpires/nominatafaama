import { IRole } from "./roles.types";

export interface IUser {
  user_id: number;
  person_id: number;
  created_at: Date;
  updated_at: Date;
  first_names: string;
  surname: string;
  email: string;
  cpf: string;
  address_id: number;
  roles: IRole[];
}

export interface ICreateUser {
  personId: number;
  password: string
  rolesId: number[];

}