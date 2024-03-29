export interface IEvangelisticExperience {
  evang_exp_id: number
  project: string
  place: string
  exp_begin_date: Date
  exp_end_date: Date
  person_id: number
  evang_exp_type_id: number
  evang_exp_approved: boolean | null
  evang_exp_type_name: string
  created_at: Date
  updated_at: Date
}

export interface ICreateEvangelisticExperience {
  project: string
  place: string
  exp_begin_date: Date
  exp_end_date: Date
  person_id: number
  evang_exp_type_id: number
  evang_exp_approved: boolean | null
}

export interface IUpdateEvangelisticExperience {
  evang_exp_id: number
  project: string
  place: string
  exp_begin_date: Date
  exp_end_date: Date
  evang_exp_type_id: number
  evang_exp_approved: boolean | null
}
