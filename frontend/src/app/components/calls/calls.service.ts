import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { ErrorServices } from '../shared/shared.service.ts/error.service'
import { AcceptInviteDto } from './types'
import { ICompleteInvite } from '../vacancies/invites/types'

@Injectable({
  providedIn: 'root',
})
export class CallsService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private errorService: ErrorServices,
  ) {}

  acceptInvite(approveData: AcceptInviteDto) {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put(environment.API + '/invites/accept', approveData, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('veja o erro completo: ', error)
          throw new Error(
            this.errorService.makeErrorMessage(error.error.message),
          )
        }),
      )
  }

  findAllRegistries(): Observable<ICompleteInvite[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<ICompleteInvite[]>(environment.API + '/invites/student', {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('veja o erro completo: ', error)
          throw new Error(
            this.errorService.makeErrorMessage(error.error.message),
          )
        }),
      )
  }
}
