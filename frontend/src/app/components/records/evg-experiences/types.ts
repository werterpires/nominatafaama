export interface IEvangelisticExperience
  extends UpdateEvangelisticExperienceDto {
  person_id: number
  evang_exp_approved: boolean | null
  evang_exp_type_name: string
  created_at: string
  updated_at: string
}

export interface CreateEvangelisticExperienceDto {
  project: string
  place: string
  exp_begin_date: string
  exp_end_date: string
  evang_exp_type_id: number
}

export interface UpdateEvangelisticExperienceDto {
  evang_exp_id: number
  project: string
  place: string
  exp_begin_date: string
  exp_end_date: string
  evang_exp_type_id: number
}
