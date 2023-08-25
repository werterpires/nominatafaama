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
import { ISinteticProfessor } from '../nominatas-professors/types'

@Injectable({
  providedIn: 'root',
})
export class ProfessorsPhotosService {
  constructor(private http: HttpClient) {}

  findAllRegistries(): Observable<ISinteticProfessor[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<ISinteticProfessor[]>(environment.API + '/nominatas/professors', {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível encontrar professores cadastrados.'),
          )
        }),
      )
  }

  findAllPhotos(professorId: number): Observable<Blob | AddressNull> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get(environment.API + '/professors/photo/' + professorId, {
        headers: head_obj,
        responseType: 'blob',
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          throw error
        }),
      )
  }

  createRegistry(
    formData: FormData,
    professorId: number,
  ): Observable<IStudentPhoto> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<IStudentPhoto>(
        environment.API + '/professors/photo/' + professorId,
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
        environment.API + '/professors',
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
      .delete<string>(environment.API + `/professors/${registryId}`, {
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
