import { ICreateAddress } from "./adresses.types";

export interface IPerson {
  person_id: number;
  first_names: string;
  surname: string;
  email: string;
  cpf: string;
  address_id: number;
  created_at: Date;
  updated_at: Date;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  reference_point: string;
  zip_code: string;
  mailbox: string;
}

export interface ICreatePerson {
  firstName: string;

  surname: string;

  email: string | null;

  cpf: string | null;

  addressId: number | null;

  address: ICreateAddress | null;
}
