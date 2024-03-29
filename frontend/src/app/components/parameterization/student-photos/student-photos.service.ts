import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { of } from 'rxjs'
import {
  AddressNull,
  IStudentPhoto,
  UpdateStudentPhotoDto,
} from '../../records/small-alone-professor-photos/types'

@Injectable({
  providedIn: 'root',
})
export class StudentPhotosService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<Blob | AddressNull> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get(environment.API + '/student-photos/student/alone-photo', {
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

  createRegistry(formData: FormData): Observable<number> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<number>(environment.API + '/student-photos/alone-photo', formData, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => new Error('Não foi possível subir as fotos.'))
        }),
      )
  }

  updateRegistry(
    updatedRegistry: UpdateStudentPhotoDto,
  ): Observable<UpdateStudentPhotoDto> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
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
