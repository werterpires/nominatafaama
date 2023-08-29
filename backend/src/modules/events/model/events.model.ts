import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import { ICreateEvent, IEvent, IUpdateEvent } from '../types/types'

@Injectable()
export class EventsModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createEvent(createEventData: ICreateEvent): Promise<IEvent> {
    let event: IEvent | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const [event_id] = await trx('events')
          .insert(createEventData)
          .returning('degree_id')

        event = {
          event_id: event_id,
          event_date: createEventData.event_date,
          event_time: createEventData.event_time,
          event_place: createEventData.event_place,
          event_address: createEventData.event_address,
          nominata_id: createEventData.nominata_id,
          event_title: createEventData.event_title,
          created_at: new Date(),
          updated_at: new Date(),
        }

        await trx.commit()
      } catch (error) {
        console.error(
          `Erro capturado na função createEvent, na eventsModel: ${error}`,
        )
        await trx.rollback()
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Já existe um evento com esses dados')
        } else {
          sentError = new Error(error.sqlMessage)
        }
      }
    })

    if (sentError) {
      throw sentError
    }

    return event!
  }

  async findAllEventsByNominataId(nominataId: number): Promise<IEvent[]> {
    let events: IEvent[] = []
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        events = await trx
          .table('events')
          .select(['events.*'])
          .where('events.nominata_id', nominataId)

        await trx.commit()
      } catch (error) {
        console.error(error)
        sentError = new Error(error.message)
        await trx.rollback()
        throw error
      }
    })

    if (sentError) {
      throw sentError
    }
    return events
  }

  async updateEventById(updateEvent: IUpdateEvent) {
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { event_address } = updateEvent
        const { event_date } = updateEvent
        const { event_time } = updateEvent
        const { event_place } = updateEvent
        const { event_title } = updateEvent

        await trx('events').where('event_id', updateEvent.event_id).update({
          event_address,
          event_date,
          event_time,
          event_place,
          event_title,
        })

        await trx.commit()
      } catch (error) {
        console.error(error)
        await trx.rollback()
        sentError = new Error(error.message)
      }
    })

    if (sentError) {
      throw sentError
    }
  }

  async deleteEvent(id: number): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        await trx('events').where('event_id', id).del()

        await trx.commit()
      } catch (error) {
        console.error(error)
        sentError = new Error(error.message)
        await trx.rollback()
      }
    })

    if (sentError) {
      throw sentError
    }

    message = 'Evento deletado com sucesso.'
    return message
  }
}
