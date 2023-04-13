export interface IPerson {
  person_id: number;
  first_name: string;
  surname: string;
  email?: string;
  cpf?: string;
  address_id?: number;
  created_at;
  updated_at;
}

export interface ICreatePerson {
  firstName: string;
  surname: string;
  email: string | null;
  cpf: string | null;
  addressId: number | null;
}
