import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import {
  ICreateEndowmentTypeDto,
  IEndowmentType,
  IUpdateEndowmentType,
} from './types'

@Injectable({
  providedIn: 'root',
})
export class EndowmentTypesService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<IEndowmentType[]> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.http
      .get<IEndowmentType[]>(`http://localhost:3000/endowment-types`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar os tipos de endowment já cadastrados.',
              ),
          )
        }),
      )
  }

  createRegistry(
    createEndowmentTypeData: ICreateEndowmentTypeDto,
  ): Observable<IEndowmentType> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.http
      .post<IEndowmentType>(
        `http://localhost:3000/endowment-types`,
        createEndowmentTypeData,
        { headers },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar o tipo de endowment.'),
          )
        }),
      )
  }

  updateRegistry(
    editEndowmentTypeData: IUpdateEndowmentType,
  ): Observable<IEndowmentType> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.http
      .put<IEndowmentType>(
        `http://localhost:3000/endowment-types`,
        editEndowmentTypeData,
        { headers },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível atualizar o tipo de endowment.'),
          )
        }),
      )
  }

  findAllByApplicationType(
    applicationType: string,
  ): Observable<IEndowmentType[]> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.http
      .get<IEndowmentType[]>(
        `http://localhost:3000/endowment-types/filter/${applicationType}`,
        { headers },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar os tipos de endowment com o tipo de aplicação especificado.',
              ),
          )
        }),
      )
  }

  deleteRegistry(registryId: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(`http://localhost:3000/endowment-types/${registryId}`, {
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
