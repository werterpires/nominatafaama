import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import {
  IAcademicDegree,
  ICreateAcademicDegreeDto,
  IUpdateAcademicDegree,
} from './types'

@Injectable({
  providedIn: 'root',
})
export class AcademicDegreeService {
  constructor(private http: HttpClient, private router: Router) {}

  findAllRegistries(): Observable<IAcademicDegree[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<IAcademicDegree[]>(environment.API + '/academic-degrees', {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar os Estados Civis já cadastrados.',
              ),
          )
        }),
      )
  }

  createRegistry(
    createAcademicDegreeData: ICreateAcademicDegreeDto,
  ): Observable<IAcademicDegree> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<IAcademicDegree>(
        environment.API + '/academic-degrees',
        createAcademicDegreeData,
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

  updateRegistry(
    editAcademicDegreeData: IUpdateAcademicDegree,
  ): Observable<IAcademicDegree> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<IAcademicDegree>(
        environment.API + '/academic-degrees',
        editAcademicDegreeData,
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

  deleteRegistry(id: number): Observable<IAcademicDegree> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .delete<IAcademicDegree>(environment.API + '/academic-degrees/' + id, {
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
