import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { ApproveRepresentaionDto } from './types'
import { IFieldRepresentation } from '../../records/representations/types'
import { IFieldRep } from '../../records/field-reps/types'

@Injectable({
  providedIn: 'root',
})
export class OneRepresentationToApproveService {
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

  findAllRegistries(repId: number): Observable<IFieldRepresentation[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<IFieldRepresentation[]>(
        environment.API + '/field-representations/rep/' + repId,
        {
          headers: head_obj,
        },
      )
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
