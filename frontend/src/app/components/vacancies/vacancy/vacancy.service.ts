import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { environment } from 'src/environments/environment'
import { UpdateVacancyDto } from '../types'
import { IBasicStudent } from '../../nominata/types'
import {
  CreateVacancyStudentDto,
  IVacancyStudent,
  UpdateVacancyStudentDto,
} from './Types'

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
          if (error.error.message == 'vacancy already answered') {
            return throwError(
              () =>
                new Error(
                  'Não é possível atualizar uma vaga com convites aceitos ou recusados.',
                ),
            )
          }
          return throwError(
            () => new Error('Não foi possível atualizar a vaga.'),
          )
        }),
      )
  }

  updateComments(
    editVacancyStudentData: UpdateVacancyStudentDto,
  ): Observable<boolean> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<boolean>(
        environment.API + '/vacancies/students',
        editVacancyStudentData,
        {
          headers: head_obj,
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          if (error.error.message == 'vacancy already answered') {
            return throwError(
              () =>
                new Error(
                  'Não é possível atualizar uma vaga com convites aceitos ou recusados.',
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
          if (error.error.message == 'vacancy already answered') {
            return throwError(
              () =>
                new Error(
                  'Não é possível Deletar uma vaga com pelo menos um convite já respondido.',
                ),
            )
          }
          return throwError(() => new Error('Não foi possível deletar a vaga.'))
        }),
      )
  }

  getStudentsWithNoAccepts(nominataId: number): Observable<IBasicStudent[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<IBasicStudent[]>(
        environment.API + `/vacancies/students/${nominataId}`,
        {
          headers: head_obj,
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          if (error.error.message == 'Registro já aprovado') {
            return throwError(() => new Error(error.message))
          }
          return throwError(
            () => new Error('Não foi possível atualizar a vaga.'),
          )
        }),
      )
  }

  addStudentToVacancy(
    createVacancyStudentData: CreateVacancyStudentDto,
  ): Observable<IVacancyStudent> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<IVacancyStudent>(
        environment.API + '/vacancies/students',
        createVacancyStudentData,
        {
          headers: head_obj,
        },
      )
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
          } else if (error.error.message == 'vacancy already accepted') {
            throw new Error(
              'Um estudante já aceitou um convite para esta vaga.',
            )
          }
          return throwError(() => new Error(error.error.message))
        }),
      )
  }

  removeStudentFromVacancy(vacancyStudentId: number): Observable<boolean> {
    console.log('vacancyStudentId:', vacancyStudentId)
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .delete<boolean>(
        environment.API + '/vacancies/students/' + `${vacancyStudentId}`,

        {
          headers: head_obj,
        },
      )
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
          } else if (
            error.error.message == 'student already answered this vacancy'
          ) {
            throw new Error(
              'Este estudante não pode ser removido pois respondeu a um convite para esta vaga.',
            )
          }
          return throwError(() => new Error(error.error.message))
        }),
      )
  }
}
