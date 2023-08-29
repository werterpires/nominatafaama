import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { environment } from 'src/environments/environment'
import { INominata } from '../nominatas/types'
import { CreateEventDto, IEvent, UpdateEventDto } from './types'

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  constructor(private http: HttpClient) {}

  getAllEvents(nomintaId: number): Observable<IEvent[]> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .get<IEvent[]>(environment.API + '/events/' + nomintaId, { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar as eventos para a nominata atual.',
              ),
          )
        }),
      )
  }

  // findAllRegistries(): Observable<IAssociation[]> {
  //   const token = localStorage.getItem('access_token')
  //   const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
  //   return this.http
  //     .get<IAssociation[]>(environment.API + '/associations', { headers })
  //     .pipe(
  //       catchError((error) => {
  //         console.log('Veja o erro completo', error)
  //         return throwError(
  //           () =>
  //             new Error(
  //               'Não foi possível encontrar as associações cadastradas.',
  //             ),
  //         )
  //       }),
  //     )
  // }

  createRegistry(createEventData: CreateEventDto): Observable<IEvent> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .post<IEvent>(environment.API + '/events', createEventData, { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar a associação.'),
          )
        }),
      )
  }

  updateRegistry(updateEventData: UpdateEventDto): Observable<IEvent> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .put<IEvent>(environment.API + '/events', updateEventData, { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível atualizar a associação.'),
          )
        }),
      )
  }

  deleteRegistry(eventId: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(environment.API + `/events/${eventId}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível deletar a o evento.'),
          )
        }),
      )
  }
}
