import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { ICompleteUser } from './types'

@Injectable({
  providedIn: 'root',
})
export class StudentsToApproveService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<ICompleteUser[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<ICompleteUser[]>(environment.API + '/approvals', {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível encontrar as linguagens.'),
          )
        }),
      )
  }

  // createRegistry(newRegistry: CreateChildDto): Observable<IChild> {
  //   const token = localStorage.getItem('access_token')
  //   let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
  //   return this.http
  //     .post<IChild>(environment.API + '/approvals', newRegistry, {
  //       headers: head_obj,
  //     })
  //     .pipe(
  //       catchError((error) => {
  //         console.log('Veja o erro completo', error)
  //         return throwError(
  //           () => new Error('Não foi possível criar a formação acadêmica.'),
  //         )
  //       }),
  //     )
  // }

  // updateRegistry(updatedRegistry: UpdateChildDto): Observable<UpdateChildDto> {
  //   const token = localStorage.getItem('access_token')
  //   let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
  //   return this.http
  //     .put<UpdateChildDto>(environment.API + '/approvals', updatedRegistry, {
  //       headers: head_obj,
  //     })
  //     .pipe(
  //       catchError((error) => {
  //         console.log('Veja o erro completo', error)
  //         return throwError(
  //           () => new Error('Não foi possível atualizar linguagens.'),
  //         )
  //       }),
  //     )
  // }

  // deleteRegistry(registryId: number): Observable<ArrayBuffer> {
  //   const token = localStorage.getItem('access_token')
  //   const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
  //   return this.http
  //     .delete(environment.API + `/approvals/${registryId}`, {
  //       headers,
  //       responseType: 'arraybuffer',
  //     })
  //     .pipe(
  //       catchError((error) => {
  //         console.log('Veja o erro completo', error)
  //         return throwError(
  //           () => new Error('Não foi possível deletar o registro.'),
  //         )
  //       }),
  //     )
  // }
}
