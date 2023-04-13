export interface IAddress {
  address_id: number;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  reference_point: string | null;
  zip_code: string;
  mailbox: string | null;
}

export interface ICreateAddress {
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  referencePoint: string | null;
  zipCode: string;
  mailbox: string | null;
}

export interface ICepAddress{
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}