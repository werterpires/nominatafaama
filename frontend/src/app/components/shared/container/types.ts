export interface IRole {
  role_id: number
  role_name: string
  role_description: string
}

export interface IUserApproved {
  roles: IRole[]
  user_approved: boolean
}

export interface IOptions {
  nominata: boolean
  cadastros: boolean
  aprovacoes: boolean
  vagas: boolean
  chamados: boolean
}

export interface IUser {
  user_approved?: boolean
  user_id: number
  principal_email: string
  person_id: number
  name: string
  cpf: string
  roles: IRole[]
  created_at: Date
  updated_at: Date
}

export interface IPermissions {
  estudante: boolean
  secretaria: boolean
  direcao: boolean
  representacao: boolean
  administrador: boolean
  isApproved: boolean
}
