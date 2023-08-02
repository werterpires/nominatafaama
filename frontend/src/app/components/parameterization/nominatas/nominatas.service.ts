import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { INominata, ICreateNominataDto, IUpdateNominata } from './types'

@Injectable({
  providedIn: 'root',
})
export class NominatasService {
  constructor(private http: HttpClient, private router: Router) {}

  findAllRegistries(): Observable<INominata[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<INominata[]>(environment.API + '/nominatas', {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível encontrar nominatas cadastradas.'),
          )
        }),
      )
  }

  createRegistry(
    createNominataData: ICreateNominataDto,
  ): Observable<INominata> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<INominata>(environment.API + '/nominatas', createNominataData, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar a nominata.'),
          )
        }),
      )
  }

  updateRegistry(editNominataData: IUpdateNominata): Observable<INominata> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<INominata>(environment.API + '/nominatas', editNominataData, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar o estado civil.'),
          )
        }),
      )
  }

  deleteRegistry(id: number): Observable<INominata> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .delete<INominata>(environment.API + '/nominatas/' + id, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar o estado civil.'),
          )
        }),
      )
  }
}
