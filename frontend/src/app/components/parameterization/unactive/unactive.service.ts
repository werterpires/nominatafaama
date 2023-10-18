import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { StringArray } from './types'

@Injectable({
  providedIn: 'root',
})
export class UnactiveService {
  constructor(private http: HttpClient) {}

  sendActiveStudents(activeCpfs: StringArray): Observable<boolean> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<boolean>(environment.API + '/students/active', activeCpfs, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível inativar os etudantes.'),
          )
        }),
      )
  }
}
