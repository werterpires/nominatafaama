import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import {
  CreateFieldRepresentationDto,
  IFieldRepresentation,
  UpdateFieldRepresentationDto,
} from './types'
import { CreateAssociationDto } from '../../parameterization/associations/types'

@Injectable({
  providedIn: 'root',
})
export class RepresentationsService {
  constructor(private http: HttpClient) {}

  findRegistries(): Observable<IFieldRepresentation[]> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .get<IFieldRepresentation[]>(
        environment.API + '/field-representations/user',
        { headers },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar as representações de campo.',
              ),
          )
        }),
      )
  }

  createRepresentation(
    createfieldRep: CreateFieldRepresentationDto,
  ): Observable<IFieldRepresentation> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .post<IFieldRepresentation>(
        environment.API + '/field-representations',
        createfieldRep,
        {
          headers,
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar a representação de campo.'),
          )
        }),
      )
  }

  updateRepresentation(
    updateRepresentationData: UpdateFieldRepresentationDto,
  ): Observable<IFieldRepresentation> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .put<IFieldRepresentation>(
        environment.API + '/field-representations',
        updateRepresentationData,
        {
          headers,
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível atualizar a representação de campo.'),
          )
        }),
      )
  }

  deleteRepresentation(
    representatationID: number,
  ): Observable<IFieldRepresentation> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<IFieldRepresentation>(
        environment.API + '/field-representations/' + representatationID,
        {
          headers,
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível atualizar a representação de campo.'),
          )
        }),
      )
  }
}
