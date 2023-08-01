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