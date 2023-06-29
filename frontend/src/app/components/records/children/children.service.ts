import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { CreateChildDto, IChild, UpdateChildDto } from './types'

@Injectable({
  providedIn: 'root',
})
export class ChildrenService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<IChild[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<IChild[]>(environment.API + '/children', {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível encontrar os filhos cadastrados.'),
          )
        }),
      )
  }

  createRegistry(newRegistry: CreateChildDto): Observable<IChild> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<IChild>(environment.API + '/children', newRegistry, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível cadastrar o filho.'),
          )
        }),
      )
  }

  updateRegistry(updatedRegistry: UpdateChildDto): Observable<UpdateChildDto> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<UpdateChildDto>(environment.API + '/children', updatedRegistry, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível atualizar os dados do filho.'),
          )
        }),
      )
  }

  deleteRegistry(registryId: number): Observable<ArrayBuffer> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete(environment.API + `/children/${registryId}`, {
        headers,
        responseType: 'arraybuffer',
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível deletar os dados do filho.'),
          )
        }),
      )
  }
}
