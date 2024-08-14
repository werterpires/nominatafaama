import { ICompleteUser } from 'src/modules/approvals/types/types'
import { IEvent } from 'src/modules/events/types/types'

export interface INominataPhoto {
  nominata_photo_id: number
  nominata_id: number
  photo: string
}

export interface ICreateNominataPhoto {
  nominata_id: number
  photo: string
}

export interface IUpdateNominataPhoto {
  nominata_photo_id: number
  nominata_id: number
  photo: string
}
