import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment.prod'
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
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<IEvangelisticExperience[]>(
        environment.API + '/evangelistic-experiences/person',
        {
          headers: head_obj,
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível encontrar as linguagens.'),
          )
        }),
      )
  }

  createRegistry(
    newRegistry: CreateEvangelisticExperienceDto,
  ): Observable<IEvangelisticExperience> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<IEvangelisticExperience>(
        environment.API + '/evangelistic-experiences',
        newRegistry,
        {
          headers: head_obj,
        },
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
    updatedRegistry: UpdateEvangelisticExperienceDto,
  ): Observable<UpdateEvangelisticExperienceDto> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<UpdateEvangelisticExperienceDto>(
        environment.API + '/evangelistic-experiences',
        updatedRegistry,
        { headers: head_obj },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível atualizar linguagens.'),
          )
        }),
      )
  }

  deleteRegistry(registryId: number): Observable<ArrayBuffer> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete(environment.API + `/evangelistic-experiences/${registryId}`, {
        headers,
        responseType: 'arraybuffer',
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
