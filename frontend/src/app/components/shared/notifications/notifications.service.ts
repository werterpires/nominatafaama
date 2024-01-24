import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { environment } from 'src/environments/environment'
import { IUserNotification } from './types'

@Injectable({
  providedIn: 'root',
})
export class notificationsService {
  constructor(private http: HttpClient) {}

  findAllRegistries(read: boolean): Observable<IUserNotification[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<IUserNotification[]>(environment.API + '/notifications/' + read, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar as notificações para o usuário.',
              ),
          )
        }),
      )
  }

  setRead(notificationId: { notificationId: number }) {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put(environment.API + '/notifications/read', notificationId, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(() => new Error(error.message))
        }),
      )
  }
}
