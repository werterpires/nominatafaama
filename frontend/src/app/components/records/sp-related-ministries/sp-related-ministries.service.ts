import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import {
  IRelatedMinistry,
  CreateRelatedMinistryDto,
  UpdateRelatedMinistryDto,
} from '../related-ministries/types'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class SpRelatedMinistriesService {
  constructor(private http: HttpClient) {}

  findAllRegistries(userId: number | null): Observable<IRelatedMinistry[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    const url = userId
      ? '/related-ministries/approve/spouse/' + userId
      : '/related-ministries/person/spouse'
    return this.http
      .get<IRelatedMinistry[]>(environment.API + url, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar os ministérios de interesse.',
              ),
          )
        }),
      )
  }

  createRegistry(
    newRegistry: CreateRelatedMinistryDto,
  ): Observable<IRelatedMinistry> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<IRelatedMinistry>(
        environment.API + '/related-ministries/spouse',
        newRegistry,
        {
          headers: head_obj,
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível criar o ministério de interesse.'),
          )
        }),
      )
  }

  updateRegistry(
    updatedRegistry: UpdateRelatedMinistryDto,
  ): Observable<UpdateRelatedMinistryDto> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<UpdateRelatedMinistryDto>(
        environment.API + '/related-ministries',
        updatedRegistry,
        { headers: head_obj },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          if (error.error.message == 'Registro já aprovado') {
            return throwError(
              () =>
                new Error(
                  'Não é possível atualizar ou deletar um item ja aprovado (com coloração verde).',
                ),
            )
          }
          return throwError(
            () =>
              new Error(
                'Não foi possível atualizar os ministérios de interesse.',
              ),
          )
        }),
      )
  }

  deleteRegistry(registryId: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(environment.API + `/related-ministries/${registryId}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          if (error.error.message == 'Registro já aprovado') {
            return throwError(
              () =>
                new Error(
                  'Não é possível atualizar ou deletar um item ja aprovado (com coloração verde).',
                ),
            )
          }
          return throwError(
            () =>
              new Error('Não foi possível deletar o ministério de interesse.'),
          )
        }),
      )
  }
}
