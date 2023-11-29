import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { ApproveInviteDto } from './types'
import { ICompleteInvite } from '../../vacancies/invites/types'
import { ErrorServices } from '../../shared/shared.service.ts/error.service'

@Injectable({
  providedIn: 'root',
})
export class InvitesToApproveService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private errorService: ErrorServices,
  ) {}

  approveInvite(approveData: ApproveInviteDto) {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put(environment.API + '/invites/evaluate', approveData, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('veja o erro completo: ', error)
          return throwError(
            () =>
              new Error(
                this.errorService.makeErrorMessage(error.error.message),
              ),
          )
        }),
      )
  }

  findAllRegistries(): Observable<ICompleteInvite[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<ICompleteInvite[]>(environment.API + '/invites/notEvaluated', {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('veja o erro completo: ', error)
          return throwError(
            () =>
              new Error(
                this.errorService.makeErrorMessage(error.error.message),
              ),
          )
        }),
      )
  }
}
