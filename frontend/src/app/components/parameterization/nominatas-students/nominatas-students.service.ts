import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { INominata } from '../nominatas/types'
import { CreateNominataStudents, ISinteticStudent } from './types'

@Injectable({
  providedIn: 'root',
})
export class NominatasStudentsService {
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

  findAllStudents(): Observable<ISinteticStudent[]> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .get<ISinteticStudent[]>(environment.API + '/nominatas/students', {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar os estudantes da nominata selecionada.',
              ),
          )
        }),
      )
  }

  createRegistry(
    createAssociationData: CreateNominataStudents,
  ): Observable<boolean> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .post<boolean>(
        environment.API + '/nominatas/students',
        createAssociationData,
        { headers },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível criar a associação.'),
          )
        }),
      )
  }

  // updateRegistry(
  //   updateAssociationData: UpdateAssociationDto,
  // ): Observable<INominata> {
  //   const token = localStorage.getItem('access_token')
  //   const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
  //   return this.http
  //     .put<INominata>(
  //       environment.API + '/associations',
  //       updateAssociationData,
  //       { headers },
  //     )
  //     .pipe(
  //       catchError((error) => {
  //         console.log('Veja o erro completo', error)
  //         return throwError(
  //           () => new Error('Não foi possível atualizar a associação.'),
  //         )
  //       }),
  //     )
  // }

  // deleteRegistry(associationId: number): Observable<string> {
  //   const token = localStorage.getItem('access_token')
  //   const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
  //   return this.http
  //     .delete<string>(environment.API + `/associations/${associationId}`, {
  //       headers,
  //     })
  //     .pipe(
  //       catchError((error) => {
  //         console.log('Veja o erro completo', error)
  //         return throwError(
  //           () => new Error('Não foi possível deletar a associação.'),
  //         )
  //       }),
  //     )
  // }
}
