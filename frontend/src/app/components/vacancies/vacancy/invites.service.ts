import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { environment } from 'src/environments/environment'
import { UpdateVacancyDto } from '../types'
import { IBasicStudent } from '../../nominata/types'
import {
  CreateInviteDto,
  CreateVacancyStudentDto,
  IVacancyStudent,
  UpdateVacancyStudentDto,
} from './Types'
import { ErrorServices } from '../../shared/shared.service.ts/error.service'

@Injectable({
  providedIn: 'root',
})
export class InvitesService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private errorService: ErrorServices,
  ) {}

  createInvite(
    createInviteData: CreateInviteDto,
  ): Observable<{ inviteId: number }> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<{ inviteId: number }>(
        environment.API + '/invites',
        createInviteData,
        {
          headers: head_obj,
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          throw new Error(
            this.errorService.makeErrorMessage(error.error.message),
          )
        }),
      )
  }
}
