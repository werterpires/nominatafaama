import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ApproveUserDto } from './types'
import { Router } from '@angular/router'
import { throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class UserApprovesService {
  constructor(private http: HttpClient, private router: Router) {}

  approveUser(approveData: ApproveUserDto) {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put(environment.API + '/users/approve', approveData, {
        headers: head_obj,
      })
      .pipe(
        catchError(() => {
          return throwError(
            () => new Error('Não fo possível aprovar esse usuário'),
          )
        }),
      )
  }
}
