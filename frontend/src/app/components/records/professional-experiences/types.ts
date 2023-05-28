export interface IProfessionalExperience {
  experience_id: number
  job: string
  job_institution: string
  job_begin_date: string
  job_end_date: string | null
  person_id: number
  experience_approved: boolean | null
  created_at: Date
  updated_at: Date
}

export interface CreateProfessionalExperienceDto {
  job: string
  job_institution: string
  job_begin_date: string
  job_end_date: string | null
}

export interface UpdateProfessionalExperienceDto {
  experience_id: number
  job: string
  job_institution: string
  job_begin_date: string
  job_end_date: string | null
  person_id: number
}
