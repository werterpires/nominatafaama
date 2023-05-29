export interface ISpouse {
  spouse_id: number
  name: string
  phone_number: string
  is_whatsapp: boolean
  alternative_email: string
  person_id: number
  origin_field_id: number
  justification: string
  birth_city: string
  birth_state: string
  primary_school_city: string
  birth_date: Date
  baptism_date: Date
  baptism_place: string
  civil_marriage_date: Date | null
  civil_marriage_city: string | null
  registry: string | null
  registry_number: string | null
  spouse_approved: boolean | null
  created_at: Date
  updated_at: Date
  primary_school_state: string
  association_name: string
  association_acronym: string
  union_name: string
  union_acronym: string
  union_id: number
  student_id: number
  civil_marriage_state: string
}

export interface ICreateSpouse {
  name: string
  cpf: string
  phone_number: string
  is_whatsapp: boolean
  alternative_email: string
  origin_field_id: number
  justification: string
  birth_city: string
  birth_state: string
  primary_school_city: string
  primary_school_state: string
  birth_date: Date
  baptism_date: Date
  baptism_place: string
  civil_marriage_date: Date | null
  civil_marriage_city: string | null
  registry: string | null
  registry_number: string | null
  student_id: number
  civil_marriage_state: string
}

export interface IUpdateSpouse {
  name: string
  spouse_id: number
  phone_number: string
  is_whatsapp: boolean
  alternative_email: string
  person_id: number
  origin_field_id: number
  justification: string
  birth_city: string
  birth_state: string
  primary_school_city: string
  primary_school_state: string
  birth_date: Date
  baptism_date: Date
  baptism_place: string
  civil_marriage_date: Date | null
  civil_marriage_city: string | null
  registry: string | null
  registry_number: string | null
  spouse_approved: boolean | null
  student_id: number
  civil_marriage_state: string
  cpf: number
}
