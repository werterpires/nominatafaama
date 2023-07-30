export interface INominata {
  nominata_id: number
  year: string
  orig_field_invites_begin: string
  created_at: Date
  updated_at: Date
}

export interface ICreateNominataDto {
  year: string
  orig_field_invites_begin: string
}

export interface IUpdateNominata {
  nominata_id: number
  year: string
  orig_field_invites_begin: string
}
