import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, catchError, throwError } from 'rxjs'
import {
  IPublication,
  CreatePublicationDto,
  UpdatePublicationDto,
} from '../publications/types'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class SpPublicationsService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<IPublication[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<IPublication[]>(environment.API + '/publications/person/spouse', {
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

  createRegistry(newRegistry: CreatePublicationDto): Observable<IPublication> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    console.log('criando livro pra esposa')
    return this.http
      .post<IPublication>(
        environment.API + '/publications/spouse',
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
    updatedRegistry: UpdatePublicationDto,
  ): Observable<UpdatePublicationDto> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<UpdatePublicationDto>(
        environment.API + '/publications',
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

  deleteRegistry(registryId: number): Observable<string> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .delete<string>(environment.API + `/publications/${registryId}`, {
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
