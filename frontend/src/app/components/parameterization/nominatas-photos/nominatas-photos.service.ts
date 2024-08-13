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
import { INominata } from '../nominatas/types'
import { INominataPhoto } from '../../nominata/types'

@Injectable({
  providedIn: 'root',
})
export class NominataPhotosService {
  constructor(private http: HttpClient) {}

  findAllNominatas(): Observable<INominata[]> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .get<INominata[]>(environment.API + '/nominatas', { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível encontrar as nominatas cadastradas.'),
          )
        }),
      )
  }

  findPhotos(nomintaId: number): Observable<INominataPhoto[]> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    console.log('nominataId', nomintaId)
    return this.http
      .get<INominataPhoto[]>(
        environment.API + '/nominata-photos/nominata/' + nomintaId,
        {
          headers: head_obj,
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          throw error
        }),
      )
  }

  createRegistry(
    formData: FormData,
    nominataId: number,
  ): Observable<IStudentPhoto> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<IStudentPhoto>(
        environment.API + '/nominata-photos/' + nominataId,
        formData,
        {
          headers: head_obj,
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível cadastrar a foto da turma.'),
          )
        }),
      )
  }

  // updateRegistry(
  //   updatedRegistry: UpdateStudentPhotoDto,
  // ): Observable<UpdateStudentPhotoDto> {
  //   const token = localStorage.getItem('access_token')
  //   let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
  //   return this.http
  //     .put<UpdateStudentPhotoDto>(
  //       environment.API + '/professors',
  //       updatedRegistry,
  //       {
  //         headers: head_obj,
  //       },
  //     )
  //     .pipe(
  //       catchError((error) => {
  //         console.log('Veja o erro completo', error)
  //         return throwError(
  //           () => new Error('Não foi possível atualizar linguagens.'),
  //         )
  //       }),
  //     )
  // }

  // deleteRegistry(registryId: number): Observable<string> {
  //   const token = localStorage.getItem('access_token')
  //   const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
  //   return this.http
  //     .delete<string>(environment.API + `/professors/${registryId}`, {
  //       headers,
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
