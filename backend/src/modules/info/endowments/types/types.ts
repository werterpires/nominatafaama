export interface IEndowment {
  endowment_id: number
  endowment_type_id: number
  person_id: number
  endowment_approved: boolean | null
  endowment_type_name: string
  application: number
  year: string
  place: string
  created_at: Date
  updated_at: Date
}

export interface ICreateEndowment {
  endowment_type_id: number
  person_id: number
  year: string
  place: string
  endowment_approved: boolean | null
}

export interface IUpdateEndowment {
  endowment_id: number
  endowment_type_id: number
  person_id: number
  year: string
  place: string
  endowment_approved: boolean | null
}
