import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { ApproveRepresentaionDto } from './types'
import { IFieldRepresentation } from '../../records/representations/types'
import { IFieldRep } from '../../records/field-reps/types'
import { ICompleteInvite } from '../../vacancies/invites/types'
import { ErrorServices } from '../../shared/shared.service.ts/error.service'
import { ApproveInviteDto } from '../invites-to_approve/types'

@Injectable({
  providedIn: 'root',
})
export class OneInviteToApproveService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private errorService: ErrorServices,
  ) {}

  findAllRegistries(repId: number): Observable<ICompleteInvite[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<ICompleteInvite[]>(environment.API + '/invites/rep/' + repId, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          throw new Error(
            this.errorService.makeErrorMessage(error.error.message),
          )
        }),
      )
  }

  findAllReps(): Observable<IFieldRep[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<IFieldRep[]>(environment.API + '/field-reps/all', {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          if (error.message.includes('pessoa com ID')) {
            return []
          } else {
            console.log('Veja o erro completo', error)
            return throwError(
              () =>
                new Error('Não foi possível encontrar os cursos cadastrados.'),
            )
          }
        }),
      )
  }
}
