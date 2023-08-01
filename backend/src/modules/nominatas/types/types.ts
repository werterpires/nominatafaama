import { ICompleteUser } from 'src/modules/approvals/types/types'

export interface INominata {
  nominata_id: number
  year: string
  orig_field_invites_begin: Date
  director_words: string
  created_at: Date
  updated_at: Date
}

export interface ICompleteNominata extends INominata {
  students: ICompleteUser[]
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

export interface ICreateNominataStudents {
  nominata_id: number
  student_id: number[]
}
