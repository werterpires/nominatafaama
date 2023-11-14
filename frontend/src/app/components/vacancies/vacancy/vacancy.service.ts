import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { environment } from 'src/environments/environment'
import { UpdateVacancyDto } from '../types'

@Injectable({
  providedIn: 'root',
})
export class VacancyService {
  constructor(private http: HttpClient, private router: Router) {}

  updateRegistry(editVacancyData: UpdateVacancyDto): Observable<boolean> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<boolean>(environment.API + '/vacancies', editVacancyData, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          if (error.error.message == 'Registro já aprovado') {
            return throwError(
              () =>
                new Error(
                  'Não é possível atualizar ou deletar um item ja aprovado (com colração verde).',
                ),
            )
          }
          return throwError(
            () => new Error('Não foi possível atualizar a vaga.'),
          )
        }),
      )
  }

  deleteRegistry(registryId: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(environment.API + `/vacancies/${registryId}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          console.log(error.error.message)
          if (error.error.message == 'Registro já aprovado') {
            return throwError(
              () =>
                new Error(
                  'Não é possível atualizar ou deletar um item ja aprovado (com coloração verde).',
                ),
            )
          }
          return throwError(() => new Error('Não foi possível deletar a vaga.'))
        }),
      )
  }
}
