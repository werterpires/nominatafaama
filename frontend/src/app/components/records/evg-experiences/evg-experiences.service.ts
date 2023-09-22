import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import {
  CreateEvangelisticExperienceDto,
  IEvangelisticExperience,
  UpdateEvangelisticExperienceDto,
} from './types'

@Injectable({
  providedIn: 'root',
})
export class EvgExperiencesService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<IEvangelisticExperience[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<IEvangelisticExperience[]>(
        environment.API + '/evangelistic-experiences/person/student',
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
                'Não foi possível encontrar as experiências evangelísticas.',
              ),
          )
        }),
      )
  }

  createRegistry(
    newRegistry: CreateEvangelisticExperienceDto,
  ): Observable<IEvangelisticExperience> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<IEvangelisticExperience>(
        environment.API + '/evangelistic-experiences/student',
        newRegistry,
        {
          headers: head_obj,
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível criar a experiência evangelística.'),
          )
        }),
      )
  }

  updateRegistry(
    updatedRegistry: UpdateEvangelisticExperienceDto,
  ): Observable<UpdateEvangelisticExperienceDto> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<UpdateEvangelisticExperienceDto>(
        environment.API + '/evangelistic-experiences',
        updatedRegistry,
        { headers: head_obj },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          if (error.error.message == 'Registro já aprovado') {
            return throwError(
              () =>
                new Error(
                  'Não é possível atualizar ou deletar um item ja aprovado (com coloração verde).',
                ),
            )
          }
          return throwError(
            () =>
              new Error(
                'Não foi possível atualizar a experiência evangelística.',
              ),
          )
        }),
      )
  }

  deleteRegistry(registryId: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(
        environment.API + `/evangelistic-experiences/${registryId}`,
        {
          headers,
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          if (error.error.message == 'Registro já aprovado') {
            return throwError(
              () =>
                new Error(
                  'Não é possível atualizar ou deletar um item ja aprovado (com coloração verde).',
                ),
            )
          }
          return throwError(
            () =>
              new Error(
                'Não foi possível deletar a experiência evangelística.',
              ),
          )
        }),
      )
  }
}
