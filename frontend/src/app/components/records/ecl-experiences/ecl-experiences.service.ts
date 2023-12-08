import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { IEclExperience, UpdateEclExperiencesDto } from './types'

@Injectable({
  providedIn: 'root',
})
export class EclExperiencesService {
  constructor(private http: HttpClient) {}

  findAllRegistries(userId: number | null): Observable<IEclExperience[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    const url = userId
      ? '/ecl-experiences/approve/student/' + userId
      : '/ecl-experiences/person/'
    return this.http
      .get<IEclExperience[]>(environment.API + url, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar as experiências eclesiásticas .',
              ),
          )
        }),
      )
  }

  updateRegistry(
    updatedRegistry: UpdateEclExperiencesDto,
  ): Observable<UpdateEclExperiencesDto> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<UpdateEclExperiencesDto>(
        environment.API + '/ecl-experiences',
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
}
