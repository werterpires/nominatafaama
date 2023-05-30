import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ICreateStudent, IStudent, IUpdateStudent } from './types'
import { environment } from 'src/environments/environment.prod'

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient) {}

  findRegistry(): Observable<IStudent> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .get<IStudent>(environment.API + '/students/edit', { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar os estudantes cadastrados.',
              ),
          )
        }),
      )
  }

  createStudent(createStudentData: ICreateStudent): Observable<IStudent> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .post<IStudent>(environment.API + '/students', createStudentData, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar o estudante.'),
          )
        }),
      )
  }

  updateStudent(updateStudentData: IUpdateStudent): Observable<IStudent> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .put<IStudent>(environment.API + '/students', updateStudentData, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível atualizar o estudante.'),
          )
        }),
      )
  }

  deleteStudent(studentId: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(environment.API + `/students/${studentId}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível deletar o estudante.'),
          )
        }),
      )
  }
}
