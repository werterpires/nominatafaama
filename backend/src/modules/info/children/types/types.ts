export interface IChild {
  child_id: number
  child_birth_date: Date
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

export interface ICreateChild {
  child_birth_date: Date
  study_grade: string
  marital_status_id: number
  student_id: number
  child_approved: boolean | null
  name: string
  cpf: string
}

export interface IUpdateChild {
  child_id: number
  child_birth_date: Date
  study_grade: string
  marital_status_id: number
  person_id: number
  student_id: number
  child_approved: boolean | null
  name: string
  cpf: string
}
