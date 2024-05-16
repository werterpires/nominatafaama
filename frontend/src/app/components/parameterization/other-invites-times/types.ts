export interface ICreateOtherInvitesTime {
  nominataId: number
  fieldId: number
  invitesBegin: string
}

export interface IUpdateOtherInvitesTime {
  otherInvitesTimeId: number
  invitesBegin: string
}

export interface IOtherInvitesTime {
  fields_invites_id: number
  nominata_id: number
  invites_begin: string
  field_id: number
  field: ITinyAssociation
  nominata: tinyNominata
}

export interface ITinyAssociation {
  association_id: number
  association_name: string
  association_acronym: string
  union_id: number
}

export interface tinyNominata {
  nominata_id: number
  year: string
  orig_field_invites_begin: Date
  other_fields_invites_begin: Date | null
  director: number
}
