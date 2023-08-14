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
  parametrizacao: boolean
  student: boolean
}

export interface IPermissions {
  estudante: boolean
  secretaria: boolean
  direcao: boolean
  representacao: boolean
  administrador: boolean
  docente: boolean
  isApproved: boolean
}
