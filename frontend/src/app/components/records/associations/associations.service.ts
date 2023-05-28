import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
  CreateAssociationDto,
  IAssociation,
  UpdateAssociationDto,
} from './types'

@Injectable({
  providedIn: 'root',
})
export class AssociationService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<IAssociation[]> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .get<IAssociation[]>('http://localhost:3000/associations', { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar as associações cadastradas.',
              ),
          )
        }),
      )
  }

  createRegistry(
    createAssociationData: CreateAssociationDto,
  ): Observable<IAssociation> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .post<IAssociation>(
        'http://localhost:3000/associations',
        createAssociationData,
        { headers },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar a associação.'),
          )
        }),
      )
  }

  updateRegistry(
    updateAssociationData: UpdateAssociationDto,
  ): Observable<IAssociation> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .put<IAssociation>(
        'http://localhost:3000/associations',
        updateAssociationData,
        { headers },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível atualizar a associação.'),
          )
        }),
      )
  }

  deleteRegistry(associationId: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(`http://localhost:3000/associations/${associationId}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível deletar a associação.'),
          )
        }),
      )
  }
}
