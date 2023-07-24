import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import {
  ICreateProfessorAssignment,
  IProfessor,
  IUpdateProfessorAssignment,
} from './types'

@Injectable({
  providedIn: 'root',
})
export class ProfessorsService {
  constructor(private http: HttpClient) {}

  findRegistry(): Observable<IProfessor> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .get<IProfessor>(environment.API + '/professors/edit', { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível encontrar o professor cadastrado.'),
          )
        }),
      )
  }

  createProfessorAssignment(
    createProfessorAssignimentData: ICreateProfessorAssignment,
  ): Observable<IProfessor> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .post<IProfessor>(
        environment.API + '/professors',
        createProfessorAssignimentData,
        {
          headers,
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar o professor.'),
          )
        }),
      )
  }

  updateProfessor(
    updateProfessorData: IUpdateProfessorAssignment,
  ): Observable<IProfessor> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .put<IProfessor>(environment.API + '/professors', updateProfessorData, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível atualizar o Professor.'),
          )
        }),
      )
  }

  // deleteStudent(studentId: number): Observable<string> {
  //   const token = localStorage.getItem('access_token')
  //   const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
  //   return this.http
  //     .delete<string>(environment.API + `/students/${studentId}`, {
  //       headers,
  //     })
  //     .pipe(
  //       catchError((error) => {
  //         console.log('Veja o erro completo', error)
  //         return throwError(
  //           () => new Error('Não foi possível deletar o estudante.'),
  //         )
  //       }),
  //     )
  // }
}
