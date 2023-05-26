export interface IProfessionalExperience {
  experience_id: number
  job: string
  job_institution: string
  job_begin_date: Date
  job_end_date: Date | null
  person_id: number
  experience_approved: boolean | null
  created_at: Date
  updated_at: Date
}

export interface ICreateProfessionalExperience {
  job: string
  job_institution: string
  job_begin_date: Date
  job_end_date: Date | null
  person_id: number
  experience_approved: boolean | null
}

export interface IUpdateProfessionalExperience {
  experience_id: number
  job: string
  job_institution: string
  job_begin_date: Date
  job_end_date: Date | null
  person_id: number
  experience_approved: boolean | null
}
