import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ICreateSpouse, ISpouse, IUpdateSpouse } from './types'

@Injectable({
  providedIn: 'root',
})
export class SpouseService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<ISpouse[]> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .get<ISpouse[]>('http://localhost:3000/spouses', { headers })
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

  findRegistryById(): Observable<ISpouse> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .get<ISpouse>('http://localhost:3000/spouses/edit', { headers })
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

  createRegistry(createSpouseData: ICreateSpouse): Observable<ISpouse> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .post<ISpouse>('http://localhost:3000/spouses', createSpouseData, {
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

  updateRegistry(updateSpouseData: IUpdateSpouse): Observable<ISpouse> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .put<ISpouse>('http://localhost:3000/spouses', updateSpouseData, {
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
      .delete<string>(`http://localhost:3000/spouses/${spouseId}`, { headers })
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
