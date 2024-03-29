import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class RecordsService {
  constructor(private http: HttpClient) {}

  getStudentMaritalStatus(userId?: number): Observable<{
    marital_status_type_name: string
  } | null> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    const url = userId
      ? `/students/marital-status/${userId}`
      : `/students/marital-status`
    return this.http
      .get<{ marital_status_type_name: string } | null>(environment.API + url, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível obter o estado civil do estudante.'),
          )
        }),
      )
  }
}
