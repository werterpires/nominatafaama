import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { ICourse, ICreateCourse, IUpdateCourse } from '../st-courses/types'

@Injectable({
  providedIn: 'root',
})
export class SpCoursesService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<ICourse[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<ICourse[]>(environment.API + '/courses/person/spouse', {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          if (error.message.includes('pessoa com ID')) {
            return []
          } else {
            console.log('Veja o erro completo', error)
            return throwError(
              () =>
                new Error('Não foi possível encontrar os cursos cadastrados.'),
            )
          }
        }),
      )
  }

  createRegistry(newRegistry: ICreateCourse): Observable<ICourse> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<ICourse>(environment.API + '/courses/spouse', newRegistry, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(() => new Error('Não foi possível criar o curso.'))
        }),
      )
  }

  updateRegistry(updatedRegistry: IUpdateCourse): Observable<IUpdateCourse> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<IUpdateCourse>(environment.API + '/courses', updatedRegistry, {
        headers: head_obj,
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
            () => new Error('Não foi possível atualizar o curso.'),
          )
        }),
      )
  }

  deleteRegistry(registryId: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(environment.API + `/courses/${registryId}`, {
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
            () => new Error('Não foi possível deletar o curso.'),
          )
        }),
      )
  }
}
