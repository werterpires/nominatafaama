import { SafeResourceUrl } from '@angular/platform-browser'
import { INominata } from '../parameterization/nominatas/types'
import { IEvent } from '../parameterization/events/types'

export interface ICompleteNominata {
  nominata_id: number
  director: number
  year: string
  orig_field_invites_begin: Date
  director_words: string
  created_at: Date
  updated_at: Date
  students: IBasicStudent[] | null
  professors?: IBasicProfessor[] | null
  photo?: { file: any; headers: Record<string, string> } | null
  imgUrl?: SafeResourceUrl
  events: IEvent[] | null
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
  photo?: { file: any; headers: Record<string, string> } | null
  imgUrl?: SafeResourceUrl
}

export interface IBasicProfessor {
  professor_id: number
  user_id: number
  person_id: number
  name: string
  assignments: string
  professor_photo_address: string | null
  photo?: { file: any; headers: Record<string, string> } | null
  imgUrl?: SafeResourceUrl
}
