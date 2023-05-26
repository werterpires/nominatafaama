export interface IPastEclExp {
  past_ecl_id: number
  function: string
  place: string
  past_exp_begin_date: Date
  past_exp_end_date: Date | null
  person_id: number
  past_ecl_approved: boolean | null
  created_at: Date
  updated_at: Date
}

export interface ICreatePastEclExp {
  function: string
  place: string
  past_exp_begin_date: Date
  past_exp_end_date: Date | null
  person_id: number
  past_ecl_approved: boolean | null
}

export interface IUpdatePastEclExp {
  past_ecl_id: number
  function: string
  place: string
  past_exp_begin_date: Date
  past_exp_end_date: Date | null
  person_id: number
  past_ecl_approved: boolean | null
}
