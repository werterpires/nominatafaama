// Tipo de objeto recuperado do banco de dados
export interface IPerson {
  person_id: number;
  name: string;
  cpf: string;
  created_at: Date;
  updated_at: Date;
}

// Tipo de objeto usado para cadastrar uma pessoa no banco de dados
export interface ICreatePerson {
  name: string;
  cpf: string;
}

export interface IUpdatePerson {
  id: number;
  name: string;
  cpf: string;
}
