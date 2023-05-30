import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { ICreateEclExpTypeDto, IEclExpType, IUpdateEclExpType } from './types'
import { environment } from 'src/environments/environment.prod'

@Injectable({
  providedIn: 'root',
})
export class EclExpTypesService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<IEclExpType[]> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.http
      .get<IEclExpType[]>(environment.API + `/ecl-exp-types`, { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar os tipos de experiência em ECL.',
              ),
          )
        }),
      )
  }

  createRegistry(
    createEclExpTypeData: ICreateEclExpTypeDto,
  ): Observable<IEclExpType> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.http
      .post<IEclExpType>(
        environment.API + `/ecl-exp-types`,
        createEclExpTypeData,
        { headers },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível criar o tipo de experiência de educação cristã.',
              ),
          )
        }),
      )
  }

  updateRegistry(
    editEclExpTypeData: IUpdateEclExpType,
  ): Observable<IEclExpType> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.http
      .put<IEclExpType>(
        environment.API + `/ecl-exp-types`,
        editEclExpTypeData,
        { headers },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível atualizar o tipo de experiência de educação cristã.',
              ),
          )
        }),
      )
  }

  deleteRegistry(eclExpTypeId: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(environment.API + `/ecl-exp-types/${eclExpTypeId}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(() => new Error('Não foi possível deletar.'))
        }),
      )
  }
}
