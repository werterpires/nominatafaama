import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import {
  CreateMaritalStatusDto,
  IMaritalStatus,
  IUpdateMaritalStatus,
} from './types'

@Injectable({
  providedIn: 'root',
})
export class MaritalStatusService {
  constructor(private http: HttpClient, private router: Router) {}

  findAllRegistries(): Observable<IMaritalStatus[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<IMaritalStatus[]>(environment.API + '/marital-status', {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar os Estados Civis já cadastrados.',
              ),
          )
        }),
      )
  }

  createRegistry(
    createMaritalStatusData: CreateMaritalStatusDto,
  ): Observable<IMaritalStatus> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<IMaritalStatus>(
        environment.API + '/marital-status',
        createMaritalStatusData,
        { headers: head_obj },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar o estado civil.'),
          )
        }),
      )
  }

  updateRegistry(
    editMaritalStatusData: IUpdateMaritalStatus,
  ): Observable<IMaritalStatus> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<IMaritalStatus>(
        environment.API + '/marital-status',
        editMaritalStatusData,
        { headers: head_obj },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar o estado civil.'),
          )
        }),
      )
  }

  deleteRegistry(registryId: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(environment.API + `/marital-status/${registryId}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível deletar o registro.'),
          )
        }),
      )
  }
}
