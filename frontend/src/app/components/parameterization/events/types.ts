export interface IEvent {
  event_id: number
  event_date: string
  event_time: string
  event_place: string
  event_address: string
  nominata_id: number
  event_title: string
  created_at: Date
  updated_at: Date
}

export interface CreateEventDto {
  event_date: string
  event_time: string
  event_place: string
  event_title: string
  event_address: string
  nominata_id: number
}

export interface UpdateEventDto {
  event_date: string
  event_time: string
  event_place: string
  event_title: string
  event_address: string
  nominata_id: number
  event_id: number
}
