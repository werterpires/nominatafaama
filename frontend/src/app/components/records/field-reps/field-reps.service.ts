import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { ICreateFieldRep, IFieldRep, IUpdateFieldRep } from './types'

@Injectable({
  providedIn: 'root',
})
export class FieldRepsService {
  constructor(private http: HttpClient) {}

  findRegistry(): Observable<IFieldRep> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .get<IFieldRep>(environment.API + '/field-reps/edit', { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível encontrar o representante de campo.'),
          )
        }),
      )
  }

  createFieldRep(createfieldRep: ICreateFieldRep): Observable<IFieldRep> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .post<IFieldRep>(environment.API + '/field-reps', createfieldRep, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar o professor.'),
          )
        }),
      )
  }

  updateFieldRep(updateProfessorData: IUpdateFieldRep): Observable<IFieldRep> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .put<IFieldRep>(environment.API + '/field-reps', updateProfessorData, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível atualizar o Professor.'),
          )
        }),
      )
  }
}
