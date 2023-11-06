import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import { ICreateEvent, IEvent, IUpdateEvent } from '../types/types'
import { NotificationsService } from 'src/shared/notifications/services/notifications.service'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Injectable()
export class EventsModel {
  @InjectModel() private readonly knex: Knex
  constructor(private notificationsService: NotificationsService) {}

  async createEvent(
    createEventData: ICreateEvent,
    currentUser: UserFromJwt
  ): Promise<IEvent> {
    let event: IEvent | null = null
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const [event_id] = await trx('events')
          .insert(createEventData)
          .returning('degree_id')

        const nominata = await trx('nominatas')
          .where('nominata_id', createEventData.nominata_id)
          .first('year')

        event = {
          event_id: event_id,
          event_date: createEventData.event_date,
          event_time: createEventData.event_time,
          event_place: createEventData.event_place,
          event_address: createEventData.event_address,
          nominata_id: createEventData.nominata_id,
          event_title: createEventData.event_title,
          created_at: new Date(),
          updated_at: new Date()
        }

        await trx.commit()

        await this.notificationsService.createNotification({
          notificationType: 8,
          action: 'inseriu',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,
          newData: {
            nominata: nominata.year,
            data: this.notificationsService.formatDate(
              createEventData.event_date
            ),
            horario: createEventData.event_time,
            local: createEventData.event_place,
            endereco: createEventData.event_address,
            titulo: createEventData.event_title
          },
          objectUserId: null,
          oldData: null,
          table: 'Eventos'
        })
      } catch (error) {
        console.error(
          `Erro capturado na função createEvent, na eventsModel: ${error}`
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

  async updateEventById(updateEvent: IUpdateEvent, currentUser: UserFromJwt) {
    let sentError: Error | null = null

    await this.knex.transaction(async (trx) => {
      try {
        const { event_address } = updateEvent
        const { event_date } = updateEvent
        const { event_time } = updateEvent
        const { event_place } = updateEvent
        const { event_title } = updateEvent
        const oldData = await trx('events')
          .leftJoin('nominatas', 'events.nominata_id', 'nominatas.nominata_id')
          .first('events.*', 'nominatas.year')
          .where('event_id', updateEvent.event_id)

        await trx('events').where('event_id', updateEvent.event_id).update({
          event_address,
          event_date,
          event_time,
          event_place,
          event_title
        })

        await trx.commit()
        await this.notificationsService.createNotification({
          notificationType: 8,
          action: 'editou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,

          newData: {
            nominata: oldData?.year,
            data: this.notificationsService.formatDate(event_date),
            horario: event_time,
            local: event_place,
            endereco: event_address,
            titulo: event_title
          },
          objectUserId: null,
          oldData: {
            nominata: oldData.year,
            data: this.notificationsService.formatDate(oldData.event_date),
            horario: oldData.event_time,
            local: oldData.event_place,
            endereco: oldData.event_address,
            titulo: oldData.event_title
          },
          table: 'Eventos'
        })
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

  async deleteEvent(id: number, currentUser: UserFromJwt): Promise<string> {
    let sentError: Error | null = null
    let message: string = ''

    await this.knex.transaction(async (trx) => {
      try {
        const oldData = await trx('events')
          .leftJoin('nominatas', 'events.nominata_id', 'nominatas.nominata_id')
          .first('events.*', 'nominatas.year')
          .where('event_id', id)

        await trx('events').where('event_id', id).del()

        await trx.commit()
        await this.notificationsService.createNotification({
          notificationType: 8,
          action: 'apagou',
          agent_name: currentUser.name,
          agentUserId: currentUser.user_id,

          newData: null,
          objectUserId: null,
          oldData: {
            nominata: oldData.year,
            data: this.notificationsService.formatDate(oldData.event_date),
            horario: oldData.event_time,
            local: oldData.event_place,
            endereco: oldData.event_address,
            titulo: oldData.event_title
          },
          table: 'Eventos'
        })
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
