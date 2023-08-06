import { ICompleteUser } from 'src/modules/approvals/types/types'

export interface INominata {
  nominata_id: number
  year: string
  orig_field_invites_begin: Date
  director_words: string
  created_at: Date
  updated_at: Date
  students?: IBasicStudent[] | null
  professors?: IBasicProfessor[] | null
}

export interface ICreateNominata {
  year: string
  orig_field_invites_begin: Date
  director_words: string
}

export interface IUpdateNominata {
  nominata_id: number
  year: string
  orig_field_invites_begin: Date
  director_words: string
}

export interface ISinteticStudent {
  name: string
  student_id: number
  person_id: number
  cpf: string
  nominata_id: number[] | null
}

export interface ISinteticProfessor {
  name: string
  professor_id: number
  person_id: number
  cpf: string
  nominata_id: number[] | null
}

export interface ICreateNominataStudents {
  nominata_id: number
  student_id: number[]
}

export interface ICreateNominataProfessors {
  nominata_id: number
  professor_id: number[]
}

export interface IBasicStudent {
  student_id: number
  user_id: number
  person_id: number
  name: string
  union_acronym: string
  association_acronym: string
  hiring_status_name: string
  small_alone_photo: string
  photo?: { file: Buffer; headers: Record<string, string> } | null
}

export interface IBasicProfessor {
  professor_id: number
  user_id: number
  person_id: number
  name: string
  assignments: string
  professor_photo_address: string | null
  photo?: { file: Buffer; headers: Record<string, string> } | null
}
