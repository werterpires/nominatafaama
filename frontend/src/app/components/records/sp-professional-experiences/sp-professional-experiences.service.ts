import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import {
  IProfessionalExperience,
  CreateProfessionalExperienceDto,
  UpdateProfessionalExperienceDto,
} from '../professional-experiences/types'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class SpProfessionalExperiencesService {
  constructor(private http: HttpClient) {}

  findAllRegistries(
    userId: number | null,
  ): Observable<IProfessionalExperience[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    const url = userId
      ? '/professional-experiences/approve/spouse/' + userId
      : '/professional-experiences/person/spouse'
    return this.http
      .get<IProfessionalExperience[]>(environment.API + url, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar as experiências profissionais.',
              ),
          )
        }),
      )
  }

  createRegistry(
    newRegistry: CreateProfessionalExperienceDto,
  ): Observable<IProfessionalExperience> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<IProfessionalExperience>(
        environment.API + '/professional-experiences/spouse',
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
              new Error('Não foi possível criar a experiência profissional.'),
          )
        }),
      )
  }

  updateRegistry(
    updatedRegistry: UpdateProfessionalExperienceDto,
  ): Observable<UpdateProfessionalExperienceDto> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<UpdateProfessionalExperienceDto>(
        environment.API + '/professional-experiences',
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
                'Não foi possível atualizar a experiência profissional.',
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
        environment.API + `/professional-experiences/${registryId}`,
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
              new Error('Não foi possível deletar a experiência profissional.'),
          )
        }),
      )
  }
}
