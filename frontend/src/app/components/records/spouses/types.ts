export interface ISpouse {
  spouse_id: number
  person_name: string
  phone_number: string
  is_whatsapp: boolean | number
  alternative_email: string
  person_id: number
  person_cpf: string
  origin_field_id: number
  justification: string
  birth_city: string
  birth_state: string
  primary_school_city: string
  birth_date: string
  baptism_date: string
  baptism_place: string
  civil_marriage_date: string | null
  civil_marriage_city: string | null
  civil_marriage_state: string | null
  registry: string | null
  registry_number: string | null
  spouse_approved: boolean | null
  created_at: string
  updated_at: string
  primary_school_state: string
  association_name: string
  association_acronym: string
  union_name: string
  union_acronym: string
  union_id: number
  student_id: number
  association_id: number
}

export interface ICreateSpouse {
  primary_school_state: string
  phone_number: string
  is_whatsapp: boolean | number
  alternative_email: string
  birth_city: string
  birth_state: string
  primary_school_city: string
  birth_date: string
  baptism_date: string
  baptism_place: string
  origin_field_id: number
  justification: string
  civil_marriage_date: string | null
  civil_marriage_city: string | null
  civil_marriage_state: string | null
  registry: string | null
  registry_number: string | null
  name: string
  cpf: string
}

export interface IUpdateSpouse {
  spouse_id: number
  phone_number: string
  is_whatsapp: boolean | number
  alternative_email: string
  justification: string
  person_id: number
  birth_city: string
  birth_state: string
  primary_school_city: string
  primary_school_state: string
  birth_date: string
  baptism_date: string
  baptism_place: string
  civil_marriage_date: string | null
  civil_marriage_city: string | null
  civil_marriage_state: string | null
  registry: string | null
  registry_number: string | null
  spouse_approved: boolean
  name: string
  cpf: string
  origin_field_id: number
}
