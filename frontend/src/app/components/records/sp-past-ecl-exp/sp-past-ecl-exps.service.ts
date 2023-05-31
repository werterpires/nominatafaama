import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import {
  CreatePastEclExpDto,
  IPastEclExp,
  UpdatePastEclExpDto,
} from '../past-ecl-exps/types'

@Injectable({
  providedIn: 'root',
})
export class SpPastEclExpService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<IPastEclExp[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<IPastEclExp[]>(environment.API + '/past-ecl-exps/person/spouse', {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível encontrar as linguagens.'),
          )
        }),
      )
  }

  createRegistry(newRegistry: CreatePastEclExpDto): Observable<IPastEclExp> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<IPastEclExp>(
        environment.API + '/past-ecl-exps/spouse',
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
    updatedRegistry: UpdatePastEclExpDto,
  ): Observable<UpdatePastEclExpDto> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<UpdatePastEclExpDto>(
        environment.API + '/past-ecl-exps',
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
      .delete<string>(environment.API + `/past-ecl-exps/${registryId}`, {
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
