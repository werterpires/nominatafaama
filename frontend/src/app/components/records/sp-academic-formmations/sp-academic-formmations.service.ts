import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import {
  ISpAcademicFormation,
  ISpCreateAcademicFormation,
  ISpUpdateAcademicFormation,
} from './types'

@Injectable({
  providedIn: 'root',
})
export class SpAcademicFormationsService {
  constructor(private http: HttpClient, private router: Router) {}

  findAllRegistries(): Observable<ISpAcademicFormation[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<ISpAcademicFormation[]>(
        environment.API + '/academic-formations/spouse',
        { headers: head_obj },
      )
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
    createAcademicFormationData: ISpCreateAcademicFormation,
  ): Observable<ISpAcademicFormation> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<ISpAcademicFormation>(
        environment.API + '/academic-formations/spouse',
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
    editAcademicFormationData: ISpUpdateAcademicFormation,
  ): Observable<ISpAcademicFormation> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<ISpAcademicFormation>(
        environment.API + '/academic-formations',
        editAcademicFormationData,
        { headers: head_obj },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar o estado civil.'),
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
          return throwError(
            () => new Error('Não foi possível deletar o registro.'),
          )
        }),
      )
  }
}
