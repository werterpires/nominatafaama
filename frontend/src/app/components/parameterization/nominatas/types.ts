export interface INominata {
  nominata_id: number
  year: string
  orig_field_invites_begin: string
  director_words: string
  director: number
  created_at: Date
  updated_at: Date
}

export interface ICreateNominataDto {
  year: string
  orig_field_invites_begin: string
  director_words: string
  director: number
}

export interface IUpdateNominata {
  nominata_id: number
  year: string
  orig_field_invites_begin: string
  director_words: string
  director: number
}
