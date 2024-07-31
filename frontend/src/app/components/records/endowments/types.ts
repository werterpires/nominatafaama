export interface IEndowment {
  endowment_id: number
  endowment_type_id: number
  person_id: number
  endowment_approved: boolean | null
  endowment_type_name: string
  application: number
  year: string | null
  place: string | null
  created_at: Date
  updated_at: Date
}

export interface CreateEndowmentDto {
  endowment_type_id: number
  year: string
  place: string
}

export interface UpdateEndowmentDto {
  endowment_id: number
  endowment_type_id: number
  person_id: number
  year: string
  place: string
}
