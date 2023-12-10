import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ICreateSpouse, ISpouse, IUpdateSpouse } from './types'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class SpouseService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<ISpouse[]> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .get<ISpouse[]>(environment.API + '/spouses', { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível encontrar os cônjuges cadastrados.'),
          )
        }),
      )
  }

  findRegistryById(userId: number | null): Observable<ISpouse> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    const url = userId ? '/spouses/approve/' + userId : '/spouses/edit'
    return this.http.get<ISpouse>(environment.API + url, { headers }).pipe(
      catchError((error) => {
        console.log('Veja o erro completo', error)
        return throwError(
          () =>
            new Error('Não foi possível encontrar os cônjuges cadastrados.'),
        )
      }),
    )
  }

  createRegistry(createSpouseData: ICreateSpouse): Observable<ISpouse> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .post<ISpouse>(environment.API + '/spouses', createSpouseData, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar o cônjuge.'),
          )
        }),
      )
  }

  updateRegistry(
    updateSpouseData: IUpdateSpouse,
    userId: number | null,
  ): Observable<ISpouse> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    const url = userId ? '/spouses/approve/' + userId : '/spouses/'
    return this.http
      .put<ISpouse>(environment.API + url, updateSpouseData, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível atualizar o cônjuge.'),
          )
        }),
      )
  }

  deleteRegistry(spouseId: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(environment.API + `/spouses/${spouseId}`, { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível deletar o cônjuge.'),
          )
        }),
      )
  }
}
