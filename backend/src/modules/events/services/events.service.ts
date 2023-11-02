import { Injectable } from '@nestjs/common'
import { CreateEventDto } from '../dto/create-event.dto'
import { UpdateEventDto } from '../dto/update-event.dto'
import { ICreateEvent, IEvent, IUpdateEvent } from '../types/types'
import { EventsModel } from '../model/events.model'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class EventsService {
  constructor(private eventsModel: EventsModel) {}

  async createEvent(
    dto: CreateEventDto,
    currentUser: UserFromJwt
  ): Promise<IEvent> {
    try {
      const createEventData: ICreateEvent = {
        event_address: dto.event_address,
        event_date: new Date(dto.event_date),
        event_place: dto.event_place,
        event_time: dto.event_time,
        nominata_id: dto.nominata_id,
        event_title: dto.event_title
      }

      const newEvent = await this.eventsModel.createEvent(
        createEventData,
        currentUser
      )
      return newEvent
    } catch (error) {
      throw error
    }
  }

  async findAllEventsByNominataId(nominataId: number): Promise<IEvent[]> {
    let events: IEvent[] = []
    try {
      events = await this.eventsModel.findAllEventsByNominataId(nominataId)
    } catch (error) {}
    return events
  }

  async updateEventById(input: UpdateEventDto, currentUser: UserFromJwt) {
    let updatedEvent: IEvent | null = null
    let sentError: Error | null = null

    try {
      const updateEventData: IUpdateEvent = {
        event_address: input.event_address,
        event_date: new Date(input.event_date),
        event_place: input.event_place,
        event_time: input.event_time,
        nominata_id: input.nominata_id,
        event_title: input.event_title,
        event_id: input.event_id
      }

      await this.eventsModel.updateEventById(updateEventData, currentUser)
    } catch (error) {
      sentError = new Error(error.message)
    }

    if (sentError !== null) {
      throw sentError
    }
  }

  remove(id: number, currentUser: UserFromJwt) {
    try {
      return this.eventsModel.deleteEvent(id, currentUser)
    } catch (error) {}
  }
}
