export interface IChild {
  child_id: number
  child_birth_date: string
  study_grade: string
  marital_status_id: number
  person_id: number
  student_id: number
  child_approved: boolean | null
  marital_status_type_name: string
  name: string
  cpf: string
  created_at: Date
  updated_at: Date
}

export interface CreateChildDto {
  child_birth_date: string
  marital_status_id: number
  study_grade: string
  name: string
  cpf: string
}

export interface UpdateChildDto {
  child_id: number
  child_birth_date: string
  marital_status_id: number
  person_id: number
  study_grade: string
  student_id: number
  name: string
  cpf: string
}
