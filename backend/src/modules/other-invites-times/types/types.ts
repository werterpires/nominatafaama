import { tinyNominata } from '../../nominatas/types/types'
import {
  IAssociation,
  ITinyAssociation
} from '../../resources/associations/types/types'

export interface ICreateOtherInvitesTime {
  nominata_id: number
  invites_begin: Date
  field_id: number
}

export interface IUpdateOtherInvitesTime {
  fields_invites_id: number
  invites_begin: Date
}

export interface IOtherInvitesTime {
  fields_invites_id: number
  nominata_id: number
  invites_begin: Date
  field_id: number
  field: ITinyAssociation
  nominata: tinyNominata
}
