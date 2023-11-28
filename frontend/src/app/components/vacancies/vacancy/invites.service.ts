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

  // updateComments(
  //   editVacancyStudentData: UpdateVacancyStudentDto,
  // ): Observable<boolean> {
  //   const token = localStorage.getItem('access_token')
  //   const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
  //   return this.http
  //     .put<boolean>(
  //       environment.API + '/vacancies/students',
  //       editVacancyStudentData,
  //       {
  //         headers: head_obj,
  //       },
  //     )
  //     .pipe(
  //       catchError((error) => {
  //         console.log('Veja o erro completo', error)
  //         throw new Error(
  //           this.errorService.makeErrorMessage(error.error.message),
  //         )
  //       }),
  //     )
  // }

  // deleteRegistry(registryId: number): Observable<string> {
  //   const token = localStorage.getItem('access_token')
  //   const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
  //   return this.http
  //     .delete<string>(environment.API + `/vacancies/${registryId}`, {
  //       headers,
  //     })
  //     .pipe(
  //       catchError((error) => {
  //         console.log('Veja o erro completo', error)
  //         throw new Error(
  //           this.errorService.makeErrorMessage(error.error.message),
  //         )
  //         return throwError(() => new Error('Não foi possível deletar a vaga.'))
  //       }),
  //     )
  // }

  // getStudentsWithNoAccepts(nominataId: number): Observable<IBasicStudent[]> {
  //   const token = localStorage.getItem('access_token')
  //   const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
  //   return this.http
  //     .get<IBasicStudent[]>(
  //       environment.API + `/vacancies/students/${nominataId}`,
  //       {
  //         headers: head_obj,
  //       },
  //     )
  //     .pipe(
  //       catchError((error) => {
  //         console.log('Veja o erro completo', error)
  //         if (error.error.message == 'Registro já aprovado') {
  //           return throwError(() => new Error(error.message))
  //         }
  //         return throwError(
  //           () => new Error('Não foi possível atualizar a vaga.'),
  //         )
  //       }),
  //     )
  // }

  // addStudentToVacancy(
  //   createVacancyStudentData: CreateVacancyStudentDto,
  // ): Observable<IVacancyStudent> {
  //   const token = localStorage.getItem('access_token')
  //   const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
  //   return this.http
  //     .post<IVacancyStudent>(
  //       environment.API + '/vacancies/students',
  //       createVacancyStudentData,
  //       {
  //         headers: head_obj,
  //       },
  //     )
  //     .pipe(
  //       catchError((error) => {
  //         console.log('Veja o erro completo', error)
  //         throw new Error(
  //           this.errorService.makeErrorMessage(error.error.message),
  //         )
  //       }),
  //     )
  // }

  // removeStudentFromVacancy(vacancyStudentId: number): Observable<boolean> {
  //   console.log('vacancyStudentId:', vacancyStudentId)
  //   const token = localStorage.getItem('access_token')
  //   const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
  //   return this.http
  //     .delete<boolean>(
  //       environment.API + '/vacancies/students/' + `${vacancyStudentId}`,

  //       {
  //         headers: head_obj,
  //       },
  //     )
  //     .pipe(
  //       catchError((error) => {
  //         console.log('Veja o erro completo', error)
  //         throw new Error(
  //           this.errorService.makeErrorMessage(error.error.message),
  //         )
  //       }),
  //     )
  // }
}
