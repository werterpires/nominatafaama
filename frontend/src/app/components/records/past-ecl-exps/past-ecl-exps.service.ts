import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { CreatePastEclExpDto, IPastEclExp, UpdatePastEclExpDto } from './types'

@Injectable({
  providedIn: 'root',
})
export class PastEclExpService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<IPastEclExp[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<IPastEclExp[]>(environment.API + '/past-ecl-exps/person/student', {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar as experiências eclesiásticas e evangelísticas anteriores ao SALT.',
              ),
          )
        }),
      )
  }

  createRegistry(newRegistry: CreatePastEclExpDto): Observable<IPastEclExp> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<IPastEclExp>(
        environment.API + '/past-ecl-exps/student',
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
              new Error(
                'Não foi possível criar a Experiência eclesiástica ou evangelística anterior ao SALT.',
              ),
          )
        }),
      )
  }

  updateRegistry(
    updatedRegistry: UpdatePastEclExpDto,
  ): Observable<UpdatePastEclExpDto> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<UpdatePastEclExpDto>(
        environment.API + '/past-ecl-exps',
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
                'Não foi possível atualizar a Experiência eclesiástica ou evangelística anterior ao SALT .',
              ),
          )
        }),
      )
  }

  deleteRegistry(registryId: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(environment.API + `/past-ecl-exps/${registryId}`, {
        headers,
      })
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
                'Não foi possível deletar a Experiência eclesiástica ou evangelística anterior ao SALT.',
              ),
          )
        }),
      )
  }
}
