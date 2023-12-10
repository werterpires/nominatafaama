import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { ApproveDto } from './types'
import { ICompleteStudent } from '../student-to-approve/types'

@Injectable({
  providedIn: 'root',
})
export class OneStudentToApproveService {
  constructor(private http: HttpClient) {}

  approveAny(data: ApproveDto, table: string): Observable<boolean> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<boolean>(environment.API + `/approvals/${table}`, data, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível realizar a aprovação: ', error),
          )
        }),
      )
  }
}
