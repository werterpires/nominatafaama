import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import {
  IStAcademicFormation,
  IStCreateAcademicFormation,
  IStUpdateAcademicFormation,
} from './types'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class StudentAcademicFormationsService {
  constructor(private http: HttpClient, private router: Router) {}

  findAllRegistries(userId: number | null): Observable<IStAcademicFormation[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    const url = userId
      ? '/academic-formations/approve/student/' + userId
      : '/academic-formations/student'
    return this.http
      .get<IStAcademicFormation[]>(environment.API + url, { headers: head_obj })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível encontrar as formações acadêmicas.'),
          )
        }),
      )
  }

  createRegistry(
    createAcademicFormationData: IStCreateAcademicFormation,
  ): Observable<IStAcademicFormation> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<IStAcademicFormation>(
        environment.API + '/academic-formations/student',
        createAcademicFormationData,
        { headers: head_obj },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar a formação acadêmica.'),
          )
        }),
      )
  }

  updateRegistry(
    editAcademicFormationData: IStUpdateAcademicFormation,
  ): Observable<IStAcademicFormation> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<IStAcademicFormation>(
        environment.API + '/academic-formations',
        editAcademicFormationData,
        { headers: head_obj },
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
          }
          return throwError(
            () => new Error('Não foi possível atualizar a formação acadêmia.'),
          )
        }),
      )
  }

  deleteRegistry(registryId: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(environment.API + `/academic-formations/${registryId}`, {
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
          return throwError(
            () => new Error('Não foi possível deletar a formação acadêmica.'),
          )
        }),
      )
  }
}
