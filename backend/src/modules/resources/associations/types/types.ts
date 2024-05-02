export interface IAssociation {
  association_id: number
  association_name: string
  association_acronym: string
  union_id: number
  union_name: string
  union_acronym: string
  created_at?: Date
  updated_at?: Date
}

export interface ICreateAssociation {
  association_name: string
  association_acronym: string
  union_id: number
}

export interface IUpdateAssociation {
  association_name: string
  association_acronym: string
  association_id: number
  union_id: number
}

export interface ITinyAssociation {
  association_id: number
  association_name: string
  association_acronym: string
  union_id: number
}
