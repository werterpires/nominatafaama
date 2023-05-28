export interface IPublication {
  publication_id: number
  publication_type_id: number
  reference: string
  link: string | null
  publication_approved: boolean | null
  person_id: number
  publication_type: string
  instructions: string
  created_at: Date
  updated_at: Date
}

export interface ICreatePublication {
  publication_type_id: number
  reference: string
  link: string | null
  publication_approved: boolean | null
  person_id: number
}

export interface IUpdatePublication {
  publication_id: number
  publication_type_id: number
  reference: string
  link: string | null
  publication_approved: boolean | null
  person_id: number
}
