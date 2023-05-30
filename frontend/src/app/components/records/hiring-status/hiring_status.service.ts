import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment.prod'
import {
  CreateHiringStatusDto,
  IHiringStatus,
  UpdateHiringStatusDto,
} from './types'

@Injectable({
  providedIn: 'root',
})
export class HiringStatusService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<IHiringStatus[]> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .get<IHiringStatus[]>(environment.API + '/hiring-status', { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar os Status de contratação cadastrados.',
              ),
          )
        }),
      )
  }

  createRegistry(
    createHiringStatusData: CreateHiringStatusDto,
  ): Observable<IHiringStatus> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .post<IHiringStatus>(
        environment.API + '/hiring-status',
        createHiringStatusData,
        { headers },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar o status de contratação.'),
          )
        }),
      )
  }

  updateRegistry(
    updateHiringStatusData: UpdateHiringStatusDto,
  ): Observable<IHiringStatus> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .put<IHiringStatus>(
        environment.API + '/hiring-status',
        updateHiringStatusData,
        { headers },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível atualizar o status de contratação.'),
          )
        }),
      )
  }

  deleteRegistry(hiring_status_id: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(environment.API + `/hiring-status/${hiring_status_id}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível deletar o status de contratação.'),
          )
        }),
      )
  }
}
