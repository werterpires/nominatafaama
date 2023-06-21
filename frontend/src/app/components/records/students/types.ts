export interface IStudent {
  person_name: string
  student_id: number
  phone_number: string
  is_whatsapp: boolean | number
  alternative_email: string
  student_mensage: string
  person_id: number
  origin_field_id: number
  justification: string
  birth_city: string
  birth_state: string
  primary_school_city: string
  birth_date: string
  baptism_date: string
  baptism_place: string
  marital_status_id: number
  hiring_status_id: number
  student_approved: boolean | null
  student_active: boolean
  association_name: string
  association_acronym: string
  union_name: string
  union_acronym: string
  union_id: number
  marital_status_type_name: string
  hiring_status_name: string
  hiring_status_description: string
  primary_school_state: string
}

export interface ICreateStudent {
  phone_number: string
  is_whatsapp: boolean
  alternative_email: string
  student_mensage: string
  origin_field_id: number
  justification: string
  birth_city: string
  birth_state: string
  primary_school_city: string
  birth_date: string
  baptism_date: string
  baptism_place: string
  marital_status_id: number
  primary_school_state: string
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
  birth_date: string
  baptism_date: string
  baptism_place: string
  marital_status_id: number
  hiring_status_id: number
  primary_school_state: string
}
