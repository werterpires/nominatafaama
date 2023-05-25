import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable, throwError} from 'rxjs'
import {catchError} from 'rxjs/operators'
import {
  ICreateEvangExpTypeDto,
  IEvangExpType,
  IUpdateEvangExpType,
} from './types'

@Injectable({
  providedIn: 'root',
})
export class EvangExpTypesService {
  constructor(private http: HttpClient) {}

  findAllEvangExpTypes(): Observable<IEvangExpType[]> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.http
      .get<IEvangExpType[]>(`http://localhost:3000/evang-exp-types`, {headers})
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar os tipos de experiência evangélica.',
              ),
          )
        }),
      )
  }
  createEvangExpType(
    createEvangExpTypeData: ICreateEvangExpTypeDto,
  ): Observable<IEvangExpType> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.http
      .post<IEvangExpType>(
        `http://localhost:3000/evang-exp-types`,
        createEvangExpTypeData,
        {headers},
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível criar o tipo de experiência evangélica.',
              ),
          )
        }),
      )
  }

  editEvangExpType(
    editEvangExpTypeData: IUpdateEvangExpType,
  ): Observable<IEvangExpType> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.http
      .put<IEvangExpType>(
        `http://localhost:3000/evang-exp-types`,
        editEvangExpTypeData,
        {headers},
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível atualizar o tipo de experiência evangélica.',
              ),
          )
        }),
      )
  }

  deleteRegistry(registryId: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(`http://localhost:3000/evang-exp-types/${registryId}`, {
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
