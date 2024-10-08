import { ICompleteUser } from 'src/modules/approvals/types/types'
import { IEvent } from 'src/modules/events/types/types'
import { INominataPhoto } from 'src/modules/nominata-photos/types'

export interface INominata {
  nominata_id: number
  director: number
  director_name: string
  year: string
  orig_field_invites_begin: Date
  other_fields_invites_begin: Date | null
  director_words: string
  created_at: Date
  updated_at: Date
  students?: IBasicStudent[] | null
  professors?: IBasicProfessor[] | null
  photo?: { file: Buffer; headers: Record<string, string> } | null
  class_photo: INominataPhoto[]
  events?: IEvent[] | null
}

export interface tinyNominata {
  nominata_id: number
  year: string
  orig_field_invites_begin: Date
  other_fields_invites_begin: Date | null
  director: number
}

export interface ICreateNominata {
  year: string
  orig_field_invites_begin: Date
  other_fields_invites_begin: Date | null
  director_words: string
  director: number
}

export interface IUpdateNominata {
  nominata_id: number
  year: string
  orig_field_invites_begin: Date
  other_fields_invites_begin: Date | null
  director_words: string
  director: number
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
  hiringField?: IHiringField
}

export interface IHiringField {
  student_id: number
  association_acronym: string
  union_acronym: string
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
