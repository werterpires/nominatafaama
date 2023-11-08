import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { ApproveRepresentaionDto } from './types'

@Injectable({
  providedIn: 'root',
})
export class RepresentationsToApproveService {
  constructor(private http: HttpClient, private router: Router) {}

  approveRepresentation(approveData: ApproveRepresentaionDto) {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put(environment.API + '/field-representations/evaluate', approveData, {
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
