import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { SetFavDto } from './types'

@Injectable({
  providedIn: 'root',
})
export class StudentsSpaceService {
  constructor(private http: HttpClient) {}

  findAllFavs(): Observable<number[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<number[]>(environment.API + `/field-reps/favorites`, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                `Não foi possível encontrar os estudantes favoritados.`,
              ),
          )
        }),
      )
  }

  setFavs(setFavData: SetFavDto): Observable<number[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<number[]>(environment.API + `/field-reps/favorites`, setFavData, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                `Não foi possível encontrar os estudantes favoritados.`,
              ),
          )
        }),
      )
  }

  setNotFavs(setFavData: SetFavDto): Observable<number[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .delete<number[]>(
        environment.API + `/field-reps/favorites/` + setFavData.studentId,
        {
          headers: head_obj,
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                `Não foi possível encontrar os estudantes favoritados.`,
              ),
          )
        }),
      )
  }
}
