import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { ICreateOtherInvitesTime, IOtherInvitesTime } from './types'

@Injectable({
  providedIn: 'root',
})
export class OtherInvitesTimesService {
  constructor(private http: HttpClient, private router: Router) {}

  findAllRegistriesByNominata(
    nominataId: number,
  ): Observable<IOtherInvitesTime[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<IOtherInvitesTime[]>(
        environment.API + '/other-invites-times/nominata/' + nominataId,
        {
          headers: head_obj,
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar as exceções para essa nominata.',
              ),
          )
        }),
      )
  }

  createRegistry(
    createOtherInvitesTimes: ICreateOtherInvitesTime,
  ): Observable<IOtherInvitesTime> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<IOtherInvitesTime>(
        environment.API + '/other-invites-times',
        createOtherInvitesTimes,
        {
          headers: head_obj,
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar a nominata.'),
          )
        }),
      )
  }

  // updateRegistry(editNominataData: IUpdateNominata): Observable<INominata> {
  //   const token = localStorage.getItem('access_token')
  //   const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
  //   return this.http
  //     .put<INominata>(environment.API + '/nominatas', editNominataData, {
  //       headers: head_obj,
  //     })
  //     .pipe(
  //       catchError((error) => {
  //         console.log('Veja o erro completo', error)
  //         return throwError(
  //           () => new Error('Não foi possível criar o estado civil.'),
  //         )
  //       }),
  //     )
  // }

  // deleteRegistry(id: number): Observable<INominata> {
  //   const token = localStorage.getItem('access_token')
  //   const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
  //   return this.http
  //     .delete<INominata>(environment.API + '/nominatas/' + id, {
  //       headers: head_obj,
  //     })
  //     .pipe(
  //       catchError((error) => {
  //         console.log('Veja o erro completo', error)
  //         return throwError(
  //           () => new Error('Não foi possível criar o estado civil.'),
  //         )
  //       }),
  //     )
  // }

  // findAllNominataYearsRegistries(): Observable<
  //   { nominataId: number; year: number }[]
  // > {
  //   const token = localStorage.getItem('access_token')
  //   const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
  //   return this.http
  //     .get<{ nominataId: number; year: number }[]>(
  //       environment.API + '/nominatas/short',
  //       {
  //         headers: head_obj,
  //       },
  //     )
  //     .pipe(
  //       catchError((error) => {
  //         console.log('Veja o erro completo', error)
  //         return throwError(
  //           () =>
  //             new Error('Não foi possível encontrar os anos das nominatas.'),
  //         )
  //       }),
  //     )
  // }
}
