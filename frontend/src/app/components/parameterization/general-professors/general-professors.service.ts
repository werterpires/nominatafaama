import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { IBasicProfessor } from '../../nominata/types'
import { ISinteticProfessor } from '../nominatas-professors/types'
import {
  ICreateProfessorAssignment,
  IProfessor,
  IUpdateProfessorAssignment,
} from '../../records/professors/types'

@Injectable({
  providedIn: 'root',
})
export class GeneralProfessorsService {
  constructor(private http: HttpClient, private router: Router) {}

  findAllRegistries(): Observable<ISinteticProfessor[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<ISinteticProfessor[]>(environment.API + '/nominatas/professors', {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível encontrar professores cadastrados.'),
          )
        }),
      )
  }

  findAllProfessors(): Observable<ISinteticProfessor[]> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .get<ISinteticProfessor[]>(environment.API + '/nominatas/professors', {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar os professores da nominata selecionada.',
              ),
          )
        }),
      )
  }

  createRegistry(
    createProfessorData: ICreateProfessorAssignment,
  ): Observable<IProfessor> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<IProfessor>(
        environment.API + '/professors/notuser',
        createProfessorData,
        {
          headers: head_obj,
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar a nominata.'),
          )
        }),
      )
  }

  updateRegistry(
    editProfessorData: IUpdateProfessorAssignment,
  ): Observable<IProfessor> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<IProfessor>(environment.API + '/professors', editProfessorData, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar o estado civil.'),
          )
        }),
      )
  }

  deleteRegistry(id: number): Observable<boolean> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .delete<boolean>(environment.API + '/professors/' + id, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar o estado civil.'),
          )
        }),
      )
  }
}
