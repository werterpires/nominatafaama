export interface IEvent {
  event_id: number
  event_date: Date
  event_time: string
  event_place: string
  event_address: string
  nominata_id: number
  event_title: string
  created_at: Date
  updated_at: Date
}

export interface ICreateEvent {
  event_date: Date
  event_time: string
  event_place: string
  event_address: string
  nominata_id: number
  event_title: string
}

export interface IUpdateEvent {
  event_id: number
  event_date: Date
  event_time: string
  event_place: string
  event_address: string
  nominata_id: number
  event_title: string
}
