import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import {
  ICreateMinistryTypeDto,
  IMinistryType,
  IUpdateMinistryType,
} from './types'
import { environment } from 'src/environments/environment.prod'

@Injectable({
  providedIn: 'root',
})
export class MinistryTypesService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<IMinistryType[]> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.http
      .get<IMinistryType[]>(environment.API + `/ministry-types`, { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar os tipos de ministério já cadastrados.',
              ),
          )
        }),
      )
  }

  createRegistry(
    createMinistryTypeData: ICreateMinistryTypeDto,
  ): Observable<IMinistryType> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.http
      .post<IMinistryType>(
        environment.API + `/ministry-types`,
        createMinistryTypeData,
        { headers },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar o tipo de ministério.'),
          )
        }),
      )
  }

  updateRegistry(
    editMinistryTypeData: IUpdateMinistryType,
  ): Observable<IMinistryType> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.http
      .put<IMinistryType>(
        environment.API + `/ministry-types`,
        editMinistryTypeData,
        { headers },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível atualizar o tipo de ministério.'),
          )
        }),
      )
  }

  deleteRegistry(registryId: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(environment.API + `/ministry-types/${registryId}`, {
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
