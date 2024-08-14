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
  ): Observable<INominataPhoto> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .post<INominataPhoto>(
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

  deleteRegistry(nominataPhotoId: number): Observable<void> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .delete<void>(environment.API + '/nominata-photos/' + nominataPhotoId, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível remover a foto da turma.'),
          )
        }),
      )
  }
}
