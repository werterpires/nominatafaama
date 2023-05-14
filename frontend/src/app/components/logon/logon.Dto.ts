import { IRole } from "../shared/container/types";

export interface ILogon{
  principalEmail: string;
  passwordHash: string;
  name: string;
  cpf: string;
  rolesId:boolean[]
}

export interface ILogonDto{
  principalEmail: string;
  passwordHash: string;
  name: string;
  cpf: string;
  rolesId:number[]
}