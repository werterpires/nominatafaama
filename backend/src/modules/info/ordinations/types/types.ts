export interface IOrdination {
  ordination_id: number
  ordination_name: string
  place: string
  year: number
  person_id: number
  ordination_approved: boolean | null
  created_at: Date
  updated_at: Date
}

export interface ICreateOrdination {
  ordination_name: string
  place: string
  year: number
  person_id: number
  ordination_approved: boolean | null
}

export interface IUpdateOrdination {
  ordination_id: number
  ordination_name: string
  place: string
  year: number
  person_id: number
  ordination_approved: boolean | null
}
