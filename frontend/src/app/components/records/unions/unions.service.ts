import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { CreateUnionDto, IUnion, UpdateUnionDto } from './types'

@Injectable({
  providedIn: 'root',
})
export class UnionService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<IUnion[]> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .get<IUnion[]>('http://localhost:3000/unions', { headers })
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

  createRegistry(createUnionData: CreateUnionDto): Observable<IUnion> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .post<IUnion>('http://localhost:3000/unions', createUnionData, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(() => new Error('Não foi possível criar a union.'))
        }),
      )
  }

  updateRegistry(updateUnionData: UpdateUnionDto): Observable<IUnion> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .put<IUnion>('http://localhost:3000/unions', updateUnionData, { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível atualizar a union.'),
          )
        }),
      )
  }

  deleteRegistry(unionId: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(`http://localhost:3000/unions/${unionId}`, { headers })
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
