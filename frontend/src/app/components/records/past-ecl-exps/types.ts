export interface IPastEclExp {
  past_ecl_id: number
  function: string
  place: string
  past_exp_begin_date: string
  past_exp_end_date: string
  person_id: number
  past_ecl_approved: boolean | null
  created_at: Date
  updated_at: Date
}

export interface CreatePastEclExpDto {
  function: string
  place: string
  past_exp_begin_date: string
  past_exp_end_date: string
}

export interface UpdatePastEclExpDto {
  past_ecl_id: number
  function: string
  place: string
  past_exp_begin_date: string
  past_exp_end_date: string
  person_id: number
}
