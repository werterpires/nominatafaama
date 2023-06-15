import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import {
  AddressNull,
  CreateStudentPhotoDto,
  IStudentPhoto,
  UpdateStudentPhotoDto,
} from './types'
import { of } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class StudentPhotosService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<Blob | AddressNull> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get(environment.API + '/student-photos/student/small-alone-photo', {
        headers: head_obj,
        responseType: 'blob', // Define o tipo de resposta como Blob
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          throw error
        }),
      )
  }

  createRegistry(formData: FormData): Observable<IStudentPhoto> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<IStudentPhoto>(
        environment.API + '/student-photos/small-alone-photo',
        formData,
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
    updatedRegistry: UpdateStudentPhotoDto,
  ): Observable<UpdateStudentPhotoDto> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .put<UpdateStudentPhotoDto>(
        environment.API + '/student-photos',
        updatedRegistry,
        {
          headers: head_obj,
        },
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
      .delete<string>(environment.API + `/student-photos/${registryId}`, {
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
