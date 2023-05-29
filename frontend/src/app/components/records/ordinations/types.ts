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

export interface CreateOrdinationDto {
  ordination_name: string
  place: string
  year: number
}

export interface UpdateOrdinationDto {
  ordination_id: number
  ordination_name: string
  place: string
  year: number
  person_id: number
}
