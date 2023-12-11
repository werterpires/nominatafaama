import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { environment } from 'src/environments/environment'
import { IVacancy } from './vacancy/Types'
import { CreateVacancyDto, UpdateVacancyDto } from './types'
import { ErrorServices } from '../shared/shared.service.ts/error.service'

@Injectable({
  providedIn: 'root',
})
export class VacanciesService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private errorService: ErrorServices,
  ) {}

  findAllRegistries(nominataId: number): Observable<IVacancy[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<IVacancy[]>(environment.API + '/vacancies/' + nominataId, {
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

  findAllNominataYearsRegistries(): Observable<
    { nominataId: number; year: number }[]
  > {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<{ nominataId: number; year: number }[]>(
        environment.API + '/nominatas/short',
        {
          headers: head_obj,
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar as vagas para a nominata selecionada.',
              ),
          )
        }),
      )
  }

  createRegistry(createVacancyData: CreateVacancyDto): Observable<boolean> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<boolean>(environment.API + '/vacancies', createVacancyData, {
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
          throw new Error(
            this.errorService.makeErrorMessage(error.error.message),
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
          throw new Error(
            this.errorService.makeErrorMessage(error.error.message),
          )
        }),
      )
  }
}
