export interface IAssociation {
  association_id: number
  association_name: string
  association_acronym: string
  union_id: number
  union_name: string
  union_acronym: string
  created_at: string
  updated_at: string
}

export interface CreateAssociationDto {
  association_name: string
  association_acronym: string
  union_id: number
}

export interface UpdateAssociationDto {
  association_id: number
  association_name: string
  association_acronym: string
  union_id: number
}
