import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment.prod'
import {
  CreatePublicationTypeDto,
  IPublicationType,
  UpdatePublicationTypeDto,
} from './types'

@Injectable({
  providedIn: 'root',
})
export class PublicationTypeService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<IPublicationType[]> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .get<IPublicationType[]>(environment.API + '/publication-types', {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível encontrar as unions cadastradas.'),
          )
        }),
      )
  }

  createRegistry(
    createPublicationTypeData: CreatePublicationTypeDto,
  ): Observable<IPublicationType> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .post<IPublicationType>(
        environment.API + '/publication-types',
        createPublicationTypeData,
        { headers },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(() => new Error('Não foi possível criar a union.'))
        }),
      )
  }

  updateRegistry(
    updatePublicationTypeData: UpdatePublicationTypeDto,
  ): Observable<IPublicationType> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .put<IPublicationType>(
        environment.API + '/publication-types',
        updatePublicationTypeData,
        { headers },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível atualizar a union.'),
          )
        }),
      )
  }

  deleteRegistry(publicationTypeId: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(
        environment.API + `/publication-types/${publicationTypeId}`,
        { headers },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível deletar a union.'),
          )
        }),
      )
  }
}
