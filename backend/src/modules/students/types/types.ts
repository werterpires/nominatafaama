export interface IStudent {
  student_id: number
  phone_number: string
  is_whatsapp: boolean
  alternative_email: string
  student_mensage: string
  person_id: number
  origin_field_id: number
  justification: string
  birth_city: string
  birth_state: string
  primary_school_city: string
  birth_date: Date
  baptism_date: Date
  baptism_place: string
  marital_status_id: number
  hiring_status_id: number
  student_approved: boolean | null
  student_active: boolean
  created_at: Date
  updated_at: Date
  person_name: string
  primary_school_state: string
  association_name: string
  association_acronym: string
  union_name: string
  union_acronym: string
  union_id: number
  marital_status_type_name: string
  hiring_status_name: string
  hiring_status_description: string
}

export interface ICreateStudent {
  phone_number: string
  is_whatsapp: boolean
  alternative_email: string
  student_mensage: string
  person_id: number
  origin_field_id: number
  justification: string
  birth_city: string
  birth_state: string
  primary_school_city: string
  birth_date: Date
  baptism_date: Date
  baptism_place: string
  marital_status_id: number
  hiring_status_id: number
  primary_school_state: string
  student_approved: boolean | null
}

export interface IUpdateStudent {
  student_id: number
  phone_number: string
  is_whatsapp: boolean
  alternative_email: string
  student_mensage: string
  person_id: number
  origin_field_id: number
  justification: string
  birth_city: string
  birth_state: string
  primary_school_city: string
  birth_date: Date
  baptism_date: Date
  baptism_place: string
  marital_status_id: number
  primary_school_state: string
  student_approved: boolean | null
}
