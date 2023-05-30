import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment.prod'
import {
  CreatePreviousMarriageDto,
  IPreviousMarriage,
  UpdatePreviousMarriageDto,
} from './types'

@Injectable({
  providedIn: 'root',
})
export class PreviousMarriageService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<IPreviousMarriage[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<IPreviousMarriage[]>(environment.API + '/previous-marriages/', {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível encontrar as ordenações.'),
          )
        }),
      )
  }

  createRegistry(
    newRegistry: CreatePreviousMarriageDto,
  ): Observable<IPreviousMarriage> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<IPreviousMarriage>(
        environment.API + '/previous-marriages/',
        newRegistry,
        {
          headers: head_obj,
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar a formação acadêmica.'),
          )
        }),
      )
  }

  updateRegistry(
    updatedRegistry: UpdatePreviousMarriageDto,
  ): Observable<UpdatePreviousMarriageDto> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<UpdatePreviousMarriageDto>(
        environment.API + '/previous-marriages',
        updatedRegistry,
        { headers: head_obj },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível atualizar linguagens.'),
          )
        }),
      )
  }

  deleteRegistry(registryId: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(environment.API + `/previous-marriages/${registryId}`, {
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
